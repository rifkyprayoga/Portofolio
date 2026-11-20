import { useState } from 'react'
import { Briefcase, Code2, Cpu, FileText, GraduationCap, Layers, Mail } from 'lucide-react'
import { experience, profile, projects, techStack } from '../data/profile'
import { useLang } from '../lib/i18n'
import { useSound } from '../lib/sound'
import AboutPortrait from './AboutPortrait'

const TYPES = [
  { id: 'all', key: 'timeline.all' },
  { id: 'work', key: 'timeline.work', icon: Briefcase },
  { id: 'edu', key: 'timeline.edu', icon: GraduationCap },
]

// terbaru di atas: yang masih berjalan dulu, lalu tahun mulai terbesar
const endYear = (e) => (e.end === null ? Infinity : Number(e.end))
const sorted = [...experience].sort((a, b) => endYear(b) - endYear(a) || Number(b.start) - Number(a.start))

function Timeline() {
  const { t, tx } = useLang()
  const { play } = useSound()
  const [type, setType] = useState('all')
  const items = type === 'all' ? sorted : sorted.filter((e) => e.type === type)

  const period = (e) => {
    const end = e.end === null ? t('timeline.now') : e.end
    return e.start === end ? e.start : `${e.start} – ${end}`
  }

  return (
    <div className="timeline-wrap" data-reveal>
      <div className="timeline-head">
        <h3 className="timeline-title">{t('timeline.title')}</h3>
        <div className="filter-row timeline-filter" role="group" aria-label={t('timeline.title')}>
          {TYPES.map((ty) => (
            <button
              key={ty.id}
              className={`filter-chip ${type === ty.id ? 'is-active' : ''}`}
              aria-pressed={type === ty.id}
              onClick={() => {
                setType(ty.id)
                play('click')
              }}
            >
              {ty.icon && <ty.icon size={14} />}
              {t(ty.key)}
            </button>
          ))}
        </div>
      </div>

      <ol className="timeline" key={type}>
        {items.map((e, i) => {
          const Icon = e.type === 'edu' ? GraduationCap : Briefcase
          return (
            <li
              key={e.org + e.start}
              className={`timeline-item ${e.end === null ? 'is-current' : ''}`}
              style={{ '--d': `${i * 70}ms` }}
            >
              <span className="timeline-dot" aria-hidden="true">
                <Icon size={14} />
              </span>
              <article className="timeline-card glass-card">
                <div className="timeline-meta mono">
                  <span>{period(e)}</span>
                  <span className={`timeline-type is-${e.type}`}>{t(e.type === 'edu' ? 'timeline.edu' : 'timeline.work')}</span>
                </div>
                <div className="timeline-body">
                  <div className="experience-logo">
                    {e.logo ? <img src={e.logo} alt="" /> : <span>{e.org.charAt(0)}</span>}
                  </div>
                  <div>
                    <h4>{e.org}</h4>
                    <p>{tx(e.role)}</p>
                    {e.desc && <p className="timeline-desc">{tx(e.desc)}</p>}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function About() {
  const { t, tx } = useLang()
  const techCount = new Set(techStack.flatMap((g) => g.skills.map((s) => s.name))).size
  const stats = [
    { icon: Code2, value: projects.length, label: t('about.stat.projects'), sub: t('about.stat.projectsSub') },
    { icon: Cpu, value: techCount, label: t('about.stat.tech'), sub: t('about.stat.techSub') },
    { icon: Layers, value: techStack.length, label: t('about.stat.fields'), sub: t('about.stat.fieldsSub') },
  ]

  return (
    <section className="section about" id="About" aria-labelledby="about-heading">
      <div className="container">
        <h2 className="section-title" id="about-heading" data-reveal>
          {t('about.title')}
        </h2>
        <p className="section-sub" data-reveal>
          {tx(profile.tagline)}
        </p>

        <div className="about-grid">
          <AboutPortrait />

          <div className="about-copy">
            <h3 className="about-greeting" data-reveal>
              {t('about.hello')} <span className="text-gradient">{profile.name}</span>
            </h3>
            {tx(profile.bio).map((p, i) => (
              <p key={i} className="about-bio" data-reveal>
                {p}
              </p>
            ))}
            <div className="about-actions" data-reveal>
              {profile.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <FileText size={16} /> {t('about.cv')}
                </a>
              )}
              <a href="#Contact" className="btn-secondary">
                <Mail size={15} /> {t('about.collab')}
              </a>
            </div>
          </div>
        </div>

        <div className="experience">
          <Timeline />

          <div className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-card glass-card" data-reveal>
                <div className="stat-top">
                  <span className="stat-icon">
                    <s.icon size={18} />
                  </span>
                  <span className="stat-value">{s.value}</span>
                </div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
