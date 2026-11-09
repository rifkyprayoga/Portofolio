import { useEffect, useState } from 'react'
import { awards, certificates, profile, projects } from '../data/profile'
import { useMusic } from '../lib/music'
import Logo from './Logo'

// Loader pembuka: web baru dibuka setelah aset utama benar-benar terunduh & siap,
// supaya tidak ada unduhan / inisialisasi berat yang terjadi saat web sudah tampil.
// Progres mengikuti tugas yang selesai. Tiap tugas punya batas waktu agar loader
// tidak macet bila koneksi lambat atau layanan luar (TikTok/YouTube) lemot.

const FONTS = [
  '400 100px Anton',
  '800 16px Montserrat',
  '300 16px Montserrat',
  '400 16px Inter',
  '600 16px Inter',
  '700 16px "Space Grotesk"',
  '400 16px "JetBrains Mono"',
]

const withTimeout = (promise, ms) =>
  Promise.race([Promise.resolve(promise).catch(() => {}), new Promise((r) => setTimeout(r, ms))])

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => (img.decode ? img.decode().catch(() => {}).then(resolve) : resolve())
    img.onerror = resolve
    img.src = src
  })

export default function WelcomeScreen({ onDone }) {
  const music = useMusic()
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState('Memuat font')
  const [leaving, setLeaving] = useState(false)

  // kesiapan player musik datang dari context → jembatani ke Promise
  const [musicReady] = useState(() => {
    let resolve
    const p = new Promise((r) => (resolve = r))
    return { p, resolve }
  })
  useEffect(() => {
    if (music.loaded.intro && music.loaded.playlist) musicReady.resolve()
  }, [music.loaded.intro, music.loaded.playlist, musicReady])

  useEffect(() => {
    const images = [
      profile.lanyardFront,
      profile.aboutPhoto,
      profile.aboutPhotoAlt,
      profile.photo,
      ...projects.map((p) => p.image),
      ...certificates.map((c) => c.image),
      ...awards.map((a) => a.image),
    ].filter(Boolean)

    const tasks = [
      { label: 'Memuat font', weight: 1, run: () => Promise.all(FONTS.map((f) => document.fonts.load(f))), ms: 6000 },
      { label: 'Memuat gambar', weight: 3, run: () => Promise.all(images.map(loadImage)), ms: 12000 },
      { label: 'Menyiapkan kartu 3D', weight: 3, run: () => import('./Lanyard'), ms: 12000 },
      { label: 'Menyiapkan musik', weight: 2, run: () => musicReady.p, ms: 9000 },
    ]
    const total = tasks.reduce((s, t) => s + t.weight, 0)
    let done = 0
    let finished = 0
    let cancelled = false
    const pending = new Set(tasks)

    // semua tugas berjalan paralel; label menampilkan tugas yang belum selesai
    tasks.forEach((t) =>
      withTimeout(t.run(), t.ms).then(() => {
        if (cancelled) return
        done += t.weight
        finished++
        pending.delete(t)
        const next = [...pending][0]
        if (next) setLabel(next.label)
      }),
    )

    let value = 0
    let raf
    const tick = () => {
      const target = (done / total) * 100
      // naik halus menuju progres nyata; saat menunggu tetap merayap pelan (maks 4% di depan)
      const cap = finished === tasks.length ? 100 : Math.min(97, target + 4)
      value += (cap - value) * (finished === tasks.length ? 0.15 : 0.04)
      if (finished === tasks.length && value > 99.4) value = 100
      setProgress(Math.round(value))
      if (value < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setLabel('Siap')
        setLeaving(true)
        setTimeout(onDone, 650)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [onDone, musicReady])

  return (
    <div className={`welcome ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite">
      <div className="welcome-inner">
        <Logo className="welcome-logo" />
        <div className="welcome-number">
          {progress}
          <small>%</small>
        </div>
        <div className="welcome-track">
          <div className="welcome-bar" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <p className="welcome-label">{label}...</p>
      </div>
    </div>
  )
}
