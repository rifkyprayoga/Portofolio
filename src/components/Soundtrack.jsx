import { ArrowUpRight, Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useMusic } from '../lib/music'
import { useLang } from '../lib/i18n'

// Section musik: info lagu, kontrol, dan daftar lagu playlist (audio saja)
export default function Soundtrack() {
  const m = useMusic()
  const { t } = useLang()
  // lagu pembuka berjalan diam-diam: kartu "sedang diputar" baru terisi saat playlist diputar
  const inPlaylist = m.phase === 'playlist'
  const playing = inPlaylist && m.status === 'playing'
  const loading = inPlaylist && m.status === 'loading'
  const onMain = inPlaylist ? m.toggle : () => m.playTrack(0)

  return (
    <section className="section soundtrack" aria-label={t('music.section')} ref={m.registerSection}>
      <div className="container">
        <div className="soundtrack-card glow-card" data-reveal data-music-control>
          <div className="soundtrack-copy">
            <span className="eyebrow">
              <Music size={14} /> {playing ? t('music.nowPlaying') : t('music.section')}
            </span>
            <h3>{t('music.title')}</h3>
            <p>{t('music.desc')}</p>

            <div className={`now-playing ${m.nowPlaying ? '' : 'is-empty'}`}>
              <div className={`eq ${playing ? 'is-playing' : ''}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="now-playing-info">
                <strong>{m.nowPlaying?.title ?? t('music.nothing')}</strong>
                <span>
                  {m.status === 'error'
                    ? t('music.blockedCode', { code: m.errorCode })
                    : loading
                      ? t('music.loading')
                      : (m.nowPlaying?.subtitle ?? t('music.hint'))}
                </span>
              </div>
              <div className="now-playing-controls">
                <button className="music-btn" onClick={m.prev} disabled={!inPlaylist} aria-label={t('music.prev')}>
                  <SkipBack size={16} />
                </button>
                <button className="music-btn is-main" onClick={onMain} aria-label={playing ? t('music.pause') : t('music.play')}>
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="music-btn" onClick={m.next} aria-label={t('music.next')}>
                  <SkipForward size={16} />
                </button>
              </div>
            </div>
            <a href={m.playlistUrl} target="_blank" rel="noreferrer" className="link-arrow">
              {t('music.open')} <ArrowUpRight size={15} />
            </a>
          </div>

          <ol className="track-list" aria-label={t('music.list')}>
            {m.tracks.length === 0 &&
              Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="skeleton track-skeleton" aria-hidden="true" />
              ))}
            {m.tracks.map((tr, i) => {
              const isCurrent = inPlaylist && m.index === i
              return (
              <li key={tr.id}>
                <button
                  className={`track ${isCurrent ? 'is-active' : ''} ${tr.blocked ? 'is-blocked' : ''}`}
                  onClick={() => m.playTrack(i)}
                  disabled={tr.blocked}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <span className="track-no mono">{String(i + 1).padStart(2, '0')}</span>
                  <img className="track-thumb" src={`https://i.ytimg.com/vi/${tr.id}/default.jpg`} alt="" loading="lazy" />
                  <span className="track-text">
                    <strong>{tr.title || t('music.track', { n: i + 1 })}</strong>
                    <span>
                      {tr.blocked
                        ? t('music.blocked')
                        : isCurrent && loading
                          ? t('music.loading')
                          : tr.author || '…'}
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
