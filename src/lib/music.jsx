import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-react'
import { music as cfg } from '../data/profile'
import { useSound } from './sound'

// =========================================================
// Musik latar
//  1. Lagu pembuka (file audio sendiri, /public/audio) diputar setiap kali web
//     dibuka / di-refresh. Browser memblokir audio sebelum ada interaksi, jadi
//     bila diblokir, musik mulai pada klik / tap / tombol pertama di mana saja.
//  2. Lagu pembuka selesai (atau dilewati) → lanjut ke playlist YouTube Music.
//  3. Lagu playlist bisa dipilih langsung kapan saja.
// =========================================================

const MusicContext = createContext(null)
export const useMusic = () => useContext(MusicContext)

let ytApiPromise
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        resolve(window.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      document.head.appendChild(s)
    })
  }
  return ytApiPromise
}

async function fetchTrackInfo(id) {
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`
    const r = await fetch(url)
    if (!r.ok) return null
    const j = await r.json()
    return { title: j.title, author: j.author_name }
  } catch {
    return null
  }
}

export function MusicProvider({ active, children }) {
  const { soundEnabled } = useSound()
  const [phase, setPhase] = useState('intro') // 'intro' | 'playlist'
  const [status, setStatus] = useState('idle') // idle | waiting | playing | paused
  const [index, setIndex] = useState(0)
  const [tracks, setTracks] = useState([]) // [{ id, title?, author? }]
  const [onHome, setOnHome] = useState(false) // section Soundtrack sedang ada di halaman
  const [dockClosed, setDockClosed] = useState(false)
  // kesiapan player — ditunggu oleh layar loading sebelum masuk ke web
  const [introReady, setIntroReady] = useState(false)
  const [playlistReady, setPlaylistReady] = useState(false)
  const [errorCode, setErrorCode] = useState(null) // error umum dari YouTube

  const introRef = useRef(null) // <audio> lagu pembuka
  const playTrackRef = useRef(null)
  const ytHostRef = useRef(null)
  const ytRef = useRef(null)
  const ytReady = useRef(false)
  const ytCreating = useRef(false)
  const alive = useRef(true)
  const phaseRef = useRef('intro')
  const introDoneRef = useRef(false)
  const wantPlay = useRef(soundEnabled) // ingin musik berbunyi (autoplay saat web dibuka bila suara situs nyala)
  const started = useRef(false) // musik sudah benar-benar terdengar
  const userPaused = useRef(false)
  const pendingYt = useRef(null)
  const watchRef = useRef(0)
  const errStreak = useRef([]) // indeks lagu yang error berturut-turut
  const listLoaded = useRef(false)

  const goPhase = useCallback((p) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const playIntro = useCallback(() => {
    const a = introRef.current
    if (!a || introDoneRef.current) return
    // hasil play() datang belakangan: abaikan bila sementara itu sudah pindah ke playlist
    const stillIntro = () => phaseRef.current === 'intro' && !introDoneRef.current
    a.play()
      .then(() => {
        if (!stillIntro()) return
        started.current = true
        setStatus('playing')
      })
      // diblokir browser (belum ada interaksi) → tunggu klik / tap pertama
      .catch(() => {
        if (stillIntro()) setStatus(userPaused.current ? 'paused' : 'waiting')
      })
  }, [])

  // lagu pembuka hanya sekali per kunjungan
  const finishIntro = useCallback(() => {
    if (introDoneRef.current) return
    introDoneRef.current = true
    introRef.current?.pause()
  }, [])

  const ensureYt = useCallback(() => {
    if (ytRef.current || ytCreating.current) return
    ytCreating.current = true

    const loadList = (p) => {
      if (listLoaded.current) return
      const ids = p.getPlaylist?.()
      if (!ids?.length) return
      listLoaded.current = true
      setTracks(ids.map((id) => ({ id })))
      ids.forEach((id) =>
        fetchTrackInfo(id).then((info) => {
          if (!info || !alive.current) return
          setTracks((list) => list.map((t) => (t.id === id ? { ...t, ...info } : t)))
        }),
      )
    }

    loadYouTubeApi().then((YT) => {
      if (!alive.current || !ytHostRef.current) return
      const host = document.createElement('div')
      ytHostRef.current.appendChild(host)
      ytRef.current = new YT.Player(host, {
        width: '320',
        height: '320',
        playerVars: { listType: 'playlist', list: cfg.playlistId, playsinline: 1, rel: 0, controls: 0 },
        events: {
          onReady: (e) => {
            ytReady.current = true
            setPlaylistReady(true)
            e.target.setLoop(true)
            loadList(e.target)
            if (pendingYt.current !== null) {
              e.target.unMute?.()
              e.target.playVideoAt(pendingYt.current)
              pendingYt.current = null
            }
          },
          onStateChange: (e) => {
            const p = e.target
            loadList(p)
            if (e.data === YT.PlayerState.PLAYING) {
              clearTimeout(watchRef.current)
              errStreak.current = []
              setErrorCode(null)
              if (phaseRef.current !== 'playlist') {
                finishIntro()
                goPhase('playlist')
              }
              started.current = true
              setIndex(p.getPlaylistIndex())
              setStatus('playing')
            } else if (e.data === YT.PlayerState.PAUSED && phaseRef.current === 'playlist') {
              setStatus(userPaused.current || started.current ? 'paused' : 'waiting')
            }
          },
          // lagu dihapus / pemiliknya melarang diputar di luar YouTube → tandai & lompat
          onError: (e) => {
            const bad = e.target.getPlaylistIndex?.() ?? -1
            const perVideo = e.data === 100 || e.data === 101 || e.data === 150
            errStreak.current.push(bad)
            // error beruntun / bukan khas per-video (mis. 153 = YouTube menolak embed dari
            // halaman ini, sering karena ekstensi / pengaturan privasi browser) → masalah
            // umum: jangan tandai semua lagu, berhenti & tampilkan kodenya
            if (!perVideo || errStreak.current.length >= 3) {
              const wrong = new Set(errStreak.current)
              errStreak.current = []
              clearTimeout(watchRef.current)
              setTracks((list) => list.map((t, j) => (wrong.has(j) ? { ...t, blocked: false } : t)))
              setErrorCode(e.data)
              setStatus('error')
              return
            }
            if (bad >= 0) setTracks((list) => list.map((t, j) => (j === bad ? { ...t, blocked: true } : t)))
            if (phaseRef.current === 'playlist') e.target.nextVideo()
          },
        },
      })
    })
  }, [finishIntro, goPhase])

  const playTrack = useCallback(
    (i) => {
      userPaused.current = false
      wantPlay.current = true
      finishIntro()
      goPhase('playlist')
      setIndex(i)
      setStatus('loading')
      const p = ytRef.current
      if (ytReady.current && p) {
        p.unMute?.()
        p.playVideoAt(i)
      } else {
        pendingYt.current = i
        ensureYt()
      }
      // pengaman: belum mulai setelah 4 detik → kirim ulang perintah putar sekali
      clearTimeout(watchRef.current)
      watchRef.current = setTimeout(() => {
        const q = ytRef.current
        if (!q?.getPlayerState || q.getPlayerState() === 1) return
        q.unMute?.()
        q.playVideoAt(i)
      }, 4000)
    },
    [finishIntro, goPhase, ensureYt],
  )

  const play = useCallback(() => {
    userPaused.current = false
    wantPlay.current = true
    if (phaseRef.current === 'intro' && !introDoneRef.current) {
      playIntro()
    } else if (ytReady.current) {
      ytRef.current.unMute?.()
      ytRef.current.playVideo()
    } else {
      pendingYt.current = pendingYt.current ?? 0
      ensureYt()
    }
  }, [playIntro, ensureYt])

  const pause = useCallback(() => {
    userPaused.current = true
    wantPlay.current = false
    introRef.current?.pause()
    ytRef.current?.pauseVideo?.()
    setStatus('paused')
  }, [])

  const toggle = useCallback(() => (status === 'playing' ? pause() : play()), [status, pause, play])

  const next = useCallback(() => {
    if (phaseRef.current === 'intro') return playTrack(0)
    userPaused.current = false
    ytRef.current?.nextVideo?.()
  }, [playTrack])

  const prev = useCallback(() => {
    if (phaseRef.current === 'intro') {
      if (introRef.current) introRef.current.currentTime = 0
      return
    }
    const p = ytRef.current
    if (!p) return
    userPaused.current = false
    if ((p.getPlaylistIndex?.() ?? 0) > 0) p.previousVideo()
    else p.seekTo(0, true)
  }, [])

  useEffect(() => {
    playTrackRef.current = playTrack
  }, [playTrack])

  // ---------- lagu pembuka: elemen <audio> biasa (ringan, tanpa iframe) ----------
  useEffect(() => {
    const a = new Audio()
    a.preload = 'auto'
    introRef.current = a
    const onReady = () => setIntroReady(true)
    const onEnded = () => playTrackRef.current?.(0) // selesai → lanjut ke playlist
    const onPause = () => {
      if (phaseRef.current === 'intro' && !a.ended && !introDoneRef.current) {
        setStatus(userPaused.current || started.current ? 'paused' : 'waiting')
      }
    }
    // file hilang / rusak → lewati lagu pembuka, langsung pakai playlist
    const onError = () => {
      setIntroReady(true)
      if (phaseRef.current === 'intro') {
        introDoneRef.current = true
        phaseRef.current = 'playlist'
        setPhase('playlist')
      }
    }
    a.addEventListener('canplaythrough', onReady)
    a.addEventListener('loadeddata', onReady)
    a.addEventListener('ended', onEnded)
    a.addEventListener('pause', onPause)
    a.addEventListener('error', onError)
    a.src = cfg.introAudio
    a.load()
    return () => {
      a.pause()
      a.removeEventListener('canplaythrough', onReady)
      a.removeEventListener('loadeddata', onReady)
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('error', onError)
      a.removeAttribute('src')
      a.load()
      introRef.current = null
    }
  }, [])

  // ---------- muat player YouTube sejak awal (selama layar loading); bersihkan saat unmount ----------
  useEffect(() => {
    ensureYt()
  }, [ensureYt])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      clearTimeout(watchRef.current)
      ytRef.current?.destroy?.()
      ytRef.current = null
      ytReady.current = false
      ytCreating.current = false
      listLoaded.current = false
    }
  }, [])

  // ---------- mulai otomatis saat web dibuka ----------
  useEffect(() => {
    if (!active || started.current || userPaused.current || !soundEnabled) return
    wantPlay.current = true
    setStatus((s) => (s === 'idle' ? 'waiting' : s))
    if (phaseRef.current === 'intro') playIntro()
  }, [active, soundEnabled, playIntro])

  // diblokir browser → mulai pada interaksi pertama di mana saja
  useEffect(() => {
    if (!active) return
    const onGesture = (e) => {
      if (started.current || userPaused.current || !wantPlay.current) return
      // klik di kontrol musik / daftar lagu ditangani tombolnya sendiri — jangan
      // ikut memulai lagu pembuka (dulu bertabrakan dengan lagu yang dipilih)
      if (e.target?.closest?.('[data-music-control]')) return
      play()
    }
    const opts = { capture: true }
    window.addEventListener('pointerdown', onGesture, opts)
    window.addEventListener('keydown', onGesture, opts)
    window.addEventListener('touchend', onGesture, opts)
    return () => {
      window.removeEventListener('pointerdown', onGesture, opts)
      window.removeEventListener('keydown', onGesture, opts)
      window.removeEventListener('touchend', onGesture, opts)
    }
  }, [active, play])

  // section Soundtrack mendaftarkan diri; di halaman lain muncul mini-player
  const registerSection = useCallback((el) => {
    setOnHome(!!el)
    if (el) setDockClosed(false)
  }, [])

  // lagu pembuka diputar diam-diam di latar: info lagu baru muncul saat playlist diputar
  const track = tracks[index]
  const current =
    phase === 'intro'
      ? null
      : { title: track?.title || `Lagu ${index + 1}`, subtitle: track?.author || `Playlist ${cfg.playlistName}` }

  const value = {
    phase,
    status,
    index,
    tracks,
    nowPlaying: current,
    loaded: { intro: introReady, playlist: playlistReady },
    errorCode,
    playlistUrl: cfg.playlistUrl,
    play,
    pause,
    toggle,
    next,
    prev,
    playTrack,
    registerSection,
  }

  const showDock = active && !onHome && !dockClosed && (status === 'playing' || status === 'paused')

  // player YouTube disembunyikan di luar layar: hanya audionya yang dipakai
  const players = (
    <div className="music-players" aria-hidden="true">
      <div ref={ytHostRef} />
    </div>
  )

  const dock = showDock && (
    <div className="music-dock" role="region" aria-label="Pemutar musik" data-music-control>
      <div className={`eq ${status === 'playing' ? 'is-playing' : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="music-dock-info">
        <strong>{current?.title ?? 'Musik latar'}</strong>
        <span>{current?.subtitle ?? `Playlist ${cfg.playlistName}`}</span>
      </div>
      <button className="music-btn" onClick={prev} aria-label="Lagu sebelumnya">
        <SkipBack size={14} />
      </button>
      <button className="music-btn is-main" onClick={toggle} aria-label={status === 'playing' ? 'Jeda' : 'Putar'}>
        {status === 'playing' ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <button className="music-btn" onClick={next} aria-label="Lagu berikutnya">
        <SkipForward size={14} />
      </button>
      <button
        className="music-btn"
        onClick={() => {
          pause()
          setDockClosed(true)
        }}
        aria-label="Tutup pemutar"
      >
        <X size={14} />
      </button>
    </div>
  )

  return (
    <MusicContext.Provider value={value}>
      {children}
      {createPortal(
        <>
          {players}
          {dock}
        </>,
        document.body,
      )}
    </MusicContext.Provider>
  )
}
