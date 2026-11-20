import { useEffect, useState } from 'react'
import { ArrowUpRight, Award, Code2, Cpu, Trophy, X } from 'lucide-react'
import { awards, certificates, projects, techStack } from '../data/profile'
import { useSound } from '../lib/sound'
import ProjectThumb from './ProjectThumb'
import { useLang } from '../lib/i18n'

const tabs = [
  { id: 'projects', key: 'pf.tab.projects', icon: Code2 },
  { id: 'certificates', key: 'pf.tab.certificates', icon: Award },
  { id: 'awards', key: 'pf.tab.awards', icon: Trophy },
  { id: 'stack', key: 'pf.tab.stack', icon: Cpu },
]

const ALL = '__all'
// urutan filter mengikuti urutan kemunculan kategori di data (kategori dikenali dari teks ID-nya)
const catKey = (c) => (typeof c === 'object' ? c.id : c)
const filters = [ALL, ...new Set(projects.map((p) => catKey(p.category)))]
const catOf = (key) => projects.find((p) => catKey(p.category) === key)?.category

function SkillLogo({ skill }) {
  const [failed, setFailed] = useState(false)
  if (failed || !skill.logo) return <span className="skill-fallback">{skill.name.slice(0, 2)}</span>
  return <img src={skill.logo} alt="" className="skill-logo" loading="lazy" onError={() => setFailed(true)} />
}

function Empty({ icon: Icon, text }) {
  return (
    <div className="empty-state glass-card">
      <Icon size={28} />
      <p>{text}</p>
    </div>
  )
}

function CertGrid({ items, onOpen, emptyText, icon }) {
  const { t, tx } = useLang()
  if (!items.length) return <Empty icon={icon} text={emptyText} />
  return (
    <div className="cert-grid">
      {items.map((c) => (
        <button key={tx(c.title)} className="cert-card glass-card" onClick={() => c.image && onOpen(c)}>
          <div className="cert-preview">
            {c.image ? <img src={c.image} alt={tx(c.title)} loading="lazy" /> : <Award size={36} />}
            {c.image && <span className="cert-overlay">{t('pf.view')}</span>}
          </div>
          <div className="cert-body">
            <h4>{tx(c.title)}</h4>
            <p className="mono">
              {c.issuer} · {c.year}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default function Portfolio({ onOpenProject }) {
  const { t, tx } = useLang()
  const [tab, setTab] = useState('projects')
  const [filter, setFilter] = useState(ALL)
  const [viewer, setViewer] = useState(null)
  const shown = filter === ALL ? projects : projects.filter((p) => catKey(p.category) === filter)
  const { play } = useSound()

  useEffect(() => {
    if (!viewer) return
    const onKey = (e) => e.key === 'Escape' && setViewer(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [viewer])

  return (
    <section className="section portfolio" id="Portofolio" aria-labelledby="portfolio-heading">
      <div className="container">
        <h2 className="section-title" id="portfolio-heading" data-reveal>
          {t('pf.title')}
        </h2>
        <p className="section-sub" data-reveal>
          {t('pf.sub')}
        </p>

        <div className="tab-bar glass" role="tablist" data-reveal>
          {tabs.map((tb) => (
            <button
              key={tb.id}
              role="tab"
              aria-selected={tab === tb.id}
              className={`tab-btn ${tab === tb.id ? 'is-active' : ''}`}
              onClick={() => {
                setTab(tb.id)
                play('click')
              }}
            >
              <tb.icon size={16} />
              <span>{t(tb.key)}</span>
            </button>
          ))}
        </div>

        <div className="tab-panel" key={tab}>
          {tab === 'projects' && (
            <div className="filter-row" role="group" aria-label={t('pf.filter')}>
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-chip ${filter === f ? 'is-active' : ''}`}
                  aria-pressed={filter === f}
                  onClick={() => {
                    setFilter(f)
                    play('click')
                  }}
                >
                  {f === ALL ? t('pf.all') : tx(catOf(f))}
                  <span className="filter-count mono">
                    {f === ALL ? projects.length : projects.filter((p) => catKey(p.category) === f).length}
                  </span>
                </button>
              ))}
            </div>
          )}
          {tab === 'projects' && (
            <div className="project-grid" key={filter}>
              {shown.map((p, i) => (
                <article key={p.id} className="project-card metal-border" style={{ '--d': `${i * 80}ms` }}>
                  <div className="project-card-inner">
                    <div className="project-thumb">
                      <ProjectThumb project={p} />
                      <span className="project-cat mono">{tx(p.category)}</span>
                      {p.badge && <span className="project-badge mono">{tx(p.badge)}</span>}
                    </div>
                    <div className="project-body">
                      <div className="project-meta mono">
                        {p.year && <span>{p.year}</span>}
                        {p.role && <span>{tx(p.role)}</span>}
                      </div>
                      <h3>{tx(p.title)}</h3>
                      <p>{tx(p.description)}</p>
                      <div className="chip-row">
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                      <button
                        className="link-arrow"
                        onClick={() => {
                          play('click')
                          onOpenProject(p.id)
                        }}
                      >
                        {t('pf.detail')} <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === 'certificates' && (
            <CertGrid items={certificates} onOpen={setViewer} icon={Award} emptyText={t('pf.certEmpty')} />
          )}
          {tab === 'awards' && (
            <CertGrid items={awards} onOpen={setViewer} icon={Trophy} emptyText={t('pf.awardEmpty')} />
          )}

          {tab === 'stack' && (
            <div className="stack-groups">
              {techStack.map((g) => (
                <div key={catKey(g.category)} className="stack-group">
                  <h4 className="mono">{tx(g.category)}</h4>
                  <div className="skill-grid">
                    {g.skills.map((s) => (
                      <div key={catKey(g.category) + s.name} className="skill-card glass-card" onMouseEnter={() => play('hover')}>
                        <SkillLogo skill={s} />
                        <span>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewer && (
        <div className="viewer" role="dialog" aria-modal="true" aria-label={tx(viewer.title)} onClick={() => setViewer(null)}>
          <button className="viewer-close icon-btn" aria-label={t('pf.close')} onClick={() => setViewer(null)}>
            <X size={20} />
          </button>
          <img src={viewer.image} alt={tx(viewer.title)} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}
