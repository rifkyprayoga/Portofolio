import { useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Lock } from 'lucide-react'
import { projects } from '../data/profile'
import BrandIcon from './BrandIcon'
import ProjectThumb from './ProjectThumb'
import { useLang } from '../lib/i18n'

export default function ProjectDetail({ id, onBack }) {
  const { t, tx } = useLang()
  const project = projects.find((p) => p.id === id)

  useEffect(() => {
    document.title = project ? `${tx(project.title)} | ${t('pf.title')}` : t('detail.notFound')
  }, [project, t, tx])

  if (!project)
    return (
      <main className="detail">
        <div className="container detail-inner">
          <button className="detail-back" onClick={onBack}>
            <ArrowLeft size={16} /> {t('detail.back')}
          </button>
          <h1 className="detail-title">{t('detail.notFound')}</h1>
        </div>
      </main>
    )

  return (
    <main className="detail">
      <div className="container detail-inner">
        <nav className="breadcrumbs mono" aria-label={t('detail.breadcrumb')}>
          <button className="detail-back" onClick={onBack}>
            <ArrowLeft size={16} /> {t('pf.title')}
          </button>
          <ChevronRight size={14} className="muted" />
          <span className="muted">{tx(project.category)}</span>
          <ChevronRight size={14} className="muted" />
          <span>{tx(project.title)}</span>
        </nav>

        <div className="detail-layout">
          <div className="detail-copy">
            <h1 className="detail-title text-gradient">{tx(project.title)}</h1>
            <dl className="detail-facts">
              {project.year && (
                <div>
                  <dt className="mono">{t('detail.year')}</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              {project.role && (
                <div>
                  <dt className="mono">{t('detail.role')}</dt>
                  <dd>{tx(project.role)}</dd>
                </div>
              )}
              <div>
                <dt className="mono">{t('detail.category')}</dt>
                <dd>{tx(project.category)}</dd>
              </div>
            </dl>
            <p className="detail-desc">{tx(project.longDesc)}</p>
            {tx(project.highlights)?.length > 0 && (
              <>
                <h2 className="detail-subtitle mono">{t('detail.features')}</h2>
                <ul className="detail-highlights">
                  {tx(project.highlights).map((h) => (
                    <li key={h}>
                      <Check size={16} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="detail-subtitle mono">{t('detail.tech')}</h2>
            <div className="chip-row">
              {project.tags.map((tag) => (
                <span key={tag} className="chip chip-lg">
                  {tag}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="btn-primary">
                  {t('detail.demo')} <ArrowUpRight size={16} />
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer" className="btn-secondary">
                  <BrandIcon id="github" size={16} /> {t('detail.source')}
                </a>
              )}
            </div>
            {project.note && (
              <p className="detail-note">
                <Lock size={14} /> {tx(project.note)}
              </p>
            )}
          </div>
          <div className="detail-preview">
            <div className="detail-preview-glow" />
            <div className="detail-window">
              <div className="detail-window-bar">
                <span />
                <span />
                <span />
              </div>
              <ProjectThumb project={project} large />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
