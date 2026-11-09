import { useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronRight } from 'lucide-react'
import { projects } from '../data/profile'
import BrandIcon from './BrandIcon'
import ProjectThumb from './ProjectThumb'

export default function ProjectDetail({ id, onBack }) {
  const project = projects.find((p) => p.id === id)

  useEffect(() => {
    document.title = project ? `${project.title} | Portofolio` : 'Projek tidak ditemukan'
  }, [project])

  if (!project)
    return (
      <main className="detail">
        <div className="container detail-inner">
          <button className="detail-back" onClick={onBack}>
            <ArrowLeft size={16} /> Kembali
          </button>
          <h1 className="detail-title">Projek tidak ditemukan</h1>
        </div>
      </main>
    )

  return (
    <main className="detail">
      <div className="container detail-inner">
        <nav className="breadcrumbs mono" aria-label="Breadcrumb">
          <button className="detail-back" onClick={onBack}>
            <ArrowLeft size={16} /> Portfolio
          </button>
          <ChevronRight size={14} className="muted" />
          <span className="muted">{project.category}</span>
          <ChevronRight size={14} className="muted" />
          <span>{project.title}</span>
        </nav>

        <div className="detail-layout">
          <div className="detail-copy">
            <h1 className="detail-title text-gradient">{project.title}</h1>
            <p className="detail-desc">{project.longDesc}</p>
            <h2 className="detail-subtitle mono">Teknologi</h2>
            <div className="chip-row">
              {project.tags.map((t) => (
                <span key={t} className="chip chip-lg">
                  {t}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="btn-primary">
                  Live Demo <ArrowUpRight size={16} />
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer" className="btn-secondary">
                  <BrandIcon id="github" size={16} /> Source Code
                </a>
              )}
            </div>
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
