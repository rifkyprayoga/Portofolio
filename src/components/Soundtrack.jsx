import { ArrowUpRight, Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useMusic } from '../lib/music'

// Section musik: info lagu, kontrol, dan daftar lagu playlist (audio saja)
export default function Soundtrack() {
  const m = useMusic()
  // lagu pembuka berjalan diam-diam: kartu "sedang diputar" baru terisi saat playlist diputar
  const inPlaylist = m.phase === 'playlist'
  const playing = inPlaylist && m.status === 'playing'
  const loading = inPlaylist && m.status === 'loading'
  const onMain = inPlaylist ? m.toggle : () => m.playTrack(0)

  return (
    <section className="section soundtrack" aria-label="Soundtrack" ref={m.registerSection}>
      <div className="container">
        <div className="soundtrack-card glow-card" data-reveal data-music-control>
          <div className="soundtrack-copy">
            <span className="eyebrow">
              <Music size={14} /> {playing ? 'Sedang diputar' : 'Soundtrack'}
            </span>
            <h3>Soundtrack ngoding</h3>
            <p>Lagu-lagu yang menemani saya debugging sampai larut malam. Siapa tahu cocok juga buat kamu.</p>

            <div className={`now-playing ${m.nowPlaying ? '' : 'is-empty'}`}>
              <div className={`eq ${playing ? 'is-playing' : ''}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="now-playing-info">
                <strong>{m.nowPlaying?.title ?? 'Belum ada lagu diputar'}</strong>
                <span>
                  {m.status === 'error'
                    ? `YouTube menolak memutar lagu (kode ${m.errorCode})`
                    : loading
                      ? 'Memuat lagu…'
                      : (m.nowPlaying?.subtitle ?? 'Tekan play atau pilih lagu dari playlist')}
                </span>
              </div>
              <div className="now-playing-controls">
                <button className="music-btn" onClick={m.prev} disabled={!inPlaylist} aria-label="Lagu sebelumnya">
                  <SkipBack size={16} />
                </button>
                <button className="music-btn is-main" onClick={onMain} aria-label={playing ? 'Jeda' : 'Putar'}>
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="music-btn" onClick={m.next} aria-label="Lagu berikutnya">
                  <SkipForward size={16} />
                </button>
              </div>
            </div>
            <a href={m.playlistUrl} target="_blank" rel="noreferrer" className="link-arrow">
              Buka di YouTube Music <ArrowUpRight size={15} />
            </a>
          </div>

          <ol className="track-list" aria-label="Daftar lagu playlist">
            {m.tracks.length === 0 &&
              Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="skeleton track-skeleton" aria-hidden="true" />
              ))}
            {m.tracks.map((t, i) => {
              const isCurrent = inPlaylist && m.index === i
              return (
              <li key={t.id}>
                <button
                  className={`track ${isCurrent ? 'is-active' : ''} ${t.blocked ? 'is-blocked' : ''}`}
                  onClick={() => m.playTrack(i)}
                  disabled={t.blocked}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <span className="track-no mono">{String(i + 1).padStart(2, '0')}</span>
                  <img className="track-thumb" src={`https://i.ytimg.com/vi/${t.id}/default.jpg`} alt="" loading="lazy" />
                  <span className="track-text">
                    <strong>{t.title || `Lagu ${i + 1}`}</strong>
                    <span>
                      {t.blocked
                        ? 'Tidak bisa diputar di luar YouTube'
                        : isCurrent && loading
                          ? 'Memuat lagu…'
                          : t.author || '…'}
                    </span>
                  </span>
                </button>
              </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
