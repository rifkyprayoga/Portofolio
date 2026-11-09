import { useEffect, useState } from 'react'
import { ArrowUpRight, Award, Code2, Cpu, Trophy, X } from 'lucide-react'
import { awards, certificates, projects, techStack } from '../data/profile'
import { useSound } from '../lib/sound'
import ProjectThumb from './ProjectThumb'

const tabs = [
  { id: 'projects', label: 'Projects', icon: Code2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'stack', label: 'Tech Stack', icon: Cpu },
]

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
  if (!items.length) return <Empty icon={icon} text={emptyText} />
  return (
    <div className="cert-grid">
      {items.map((c) => (
        <button key={c.title} className="cert-card glass-card" onClick={() => c.image && onOpen(c)}>
          <div className="cert-preview">
            {c.image ? <img src={c.image} alt={c.title} loading="lazy" /> : <Award size={36} />}
            {c.image && <span className="cert-overlay">Lihat</span>}
          </div>
          <div className="cert-body">
            <h4>{c.title}</h4>
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
  const [tab, setTab] = useState('projects')
  const [viewer, setViewer] = useState(null)
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
          Portfolio
        </h2>
        <p className="section-sub" data-reveal>
          Projek, sertifikat, pencapaian, dan teknologi yang saya pakai.
        </p>

        <div className="tab-bar glass" role="tablist" data-reveal>
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`tab-btn ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => {
                setTab(t.id)
                play('click')
              }}
            >
              <t.icon size={16} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-panel" key={tab}>
          {tab === 'projects' && (
            <div className="project-grid">
              {projects.map((p, i) => (
                <article key={p.id} className="project-card metal-border" style={{ '--d': `${i * 80}ms` }}>
                  <div className="project-card-inner">
                    <div className="project-thumb">
                      <ProjectThumb project={p} />
                      <span className="project-cat mono">{p.category}</span>
                    </div>
                    <div className="project-body">
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
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
                        Detail <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === 'certificates' && (
            <CertGrid items={certificates} onOpen={setViewer} icon={Award} emptyText="Sertifikat segera ditambahkan." />
          )}
          {tab === 'awards' && (
            <CertGrid items={awards} onOpen={setViewer} icon={Trophy} emptyText="Pencapaian segera ditambahkan." />
          )}

          {tab === 'stack' && (
            <div className="stack-groups">
              {techStack.map((g) => (
                <div key={g.category} className="stack-group">
                  <h4 className="mono">{g.category}</h4>
                  <div className="skill-grid">
                    {g.skills.map((s) => (
                      <div key={g.category + s.name} className="skill-card glass-card" onMouseEnter={() => play('hover')}>
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
        <div className="viewer" role="dialog" aria-modal="true" aria-label={viewer.title} onClick={() => setViewer(null)}>
          <button className="viewer-close icon-btn" aria-label="Tutup" onClick={() => setViewer(null)}>
            <X size={20} />
          </button>
          <img src={viewer.image} alt={viewer.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}
