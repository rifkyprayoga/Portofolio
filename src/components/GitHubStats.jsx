import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, FolderGit2, GitFork, Users } from 'lucide-react'
import { profile } from '../data/profile'
import { useLang } from '../lib/i18n'
import BrandIcon from './BrandIcon'

// Statistik GitHub diambil langsung dari API publik GitHub (tanpa token, batas 60 permintaan/jam per pengunjung).
// Hasil disimpan sementara di sessionStorage supaya tidak memanggil API setiap kali halaman dibuka.
const CACHE_KEY = 'gh-stats-v1'
const CACHE_MS = 30 * 60 * 1000

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Kotlin: '#a97bff',
  Java: '#b07219',
  Python: '#3572a5',
  Dart: '#00b4ab',
  PHP: '#4f5d95',
  HTML: '#e34c26',
  CSS: '#663399',
}

async function fetchStats(user) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (cached && cached.user === user && Date.now() - cached.at < CACHE_MS) return cached.data
  } catch {
    // storage diblokir → ambil langsung
  }
  const [u, r] = await Promise.all([
    fetch(`https://api.github.com/users/${user}`),
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
  ])
  if (!u.ok || !r.ok) throw new Error('github')
  const info = await u.json()
  const repos = await r.json()
  const own = repos.filter((x) => !x.fork)
  const langs = {}
  for (const x of own) if (x.language) langs[x.language] = (langs[x.language] || 0) + 1
  const data = {
    url: info.html_url,
    publicRepos: info.public_repos,
    followers: info.followers,
    since: new Date(info.created_at).getFullYear(),
    ownCount: own.length,
    langs: Object.entries(langs).sort((a, b) => b[1] - a[1]),
    recent: own
      .filter((x) => x.size > 0)
      .slice(0, 4)
      .map((x) => ({ name: x.name, url: x.html_url, desc: x.description, lang: x.language, pushed: x.pushed_at })),
  }
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ user, at: Date.now(), data }))
  } catch {
    // abaikan
  }
  return data
}

export default function GitHubStats() {
  const { t, lang } = useLang()
  const user = profile.githubUser
  const [state, setState] = useState({ status: 'loading', data: null })

  useEffect(() => {
    if (!user) return
    let alive = true
    fetchStats(user)
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error', data: null }))
    return () => {
      alive = false
    }
  }, [user])

  if (!user) return null
  const d = state.data
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const totalLang = d ? d.langs.reduce((s, [, n]) => s + n, 0) : 0

  const tiles = [
    { icon: FolderGit2, label: t('gh.repos'), value: d?.publicRepos },
    { icon: GitFork, label: t('gh.own'), value: d?.ownCount },
    { icon: Users, label: t('gh.followers'), value: d?.followers },
    { icon: CalendarDays, label: t('gh.since'), value: d?.since },
  ]

  return (
    <section className="section github" id="GitHub" aria-labelledby="github-heading">
      <div className="container">
        <h2 className="section-title" id="github-heading" data-reveal>
          {t('gh.title')}
        </h2>
        <p className="section-sub" data-reveal>
          {t('gh.sub')}
        </p>

        {state.status === 'error' ? (
          <p className="empty-state glass-card">{t('gh.error')}</p>
        ) : (
          <div className="gh-grid" data-reveal>
            <div className="gh-tiles">
              {tiles.map((tile) => (
                <div key={tile.label} className="gh-tile glass-card">
                  <tile.icon size={18} className="gh-tile-icon" />
                  {d ? <strong>{tile.value}</strong> : <span className="skeleton gh-skel-num" />}
                  <span>{tile.label}</span>
                </div>
              ))}
            </div>

            <div className="gh-panel glass-card">
              <h3 className="gh-panel-title mono">{t('gh.langs')}</h3>
              {d ? (
                <>
                  <div className="gh-langbar" role="img" aria-label={d.langs.map(([l, n]) => `${l} ${n}`).join(', ')}>
                    {d.langs.map(([l, n]) => (
                      <span key={l} style={{ flex: n, background: LANG_COLORS[l] || 'var(--accent-2)' }} />
                    ))}
                  </div>
                  <ul className="gh-langs">
                    {d.langs.map(([l, n]) => (
                      <li key={l}>
                        <i style={{ background: LANG_COLORS[l] || 'var(--accent-2)' }} />
                        {l}
                        <span className="mono">{Math.round((n / totalLang) * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <span className="skeleton gh-skel-bar" />
              )}

              <h3 className="gh-panel-title mono">{t('gh.recent')}</h3>
              <ul className="gh-repos">
                {d
                  ? d.recent.map((r) => (
                      <li key={r.name}>
                        <a href={r.url} target="_blank" rel="noreferrer">
                          <strong>{r.name}</strong>
                          <span>{r.desc || t('gh.noDesc')}</span>
                          <small className="mono">
                            {r.lang && (
                              <>
                                <i style={{ background: LANG_COLORS[r.lang] || 'var(--accent-2)' }} />
                                {r.lang} ·{' '}
                              </>
                            )}
                            {t('gh.updated', { when: fmtDate(r.pushed) })}
                          </small>
                        </a>
                      </li>
                    ))
                  : Array.from({ length: 3 }, (_, i) => <li key={i} className="skeleton gh-skel-row" />)}
              </ul>

              <a href={d?.url || `https://github.com/${user}`} target="_blank" rel="noreferrer" className="link-arrow">
                <BrandIcon id="github" size={15} /> {t('gh.open')} <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
