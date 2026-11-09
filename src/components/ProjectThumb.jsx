// Thumbnail proyek: gambar asli jika ada, jika tidak mockup ponsel bergradasi
export default function ProjectThumb({ project, large = false }) {
  if (project.image)
    return <img src={project.image} alt={`Tampilan ${project.title}`} className="thumb-img" loading="lazy" />
  return (
    <div className={`thumb-mock ${large ? 'is-large' : ''}`} style={{ background: project.gradient }} aria-hidden="true">
      <div className="thumb-phone">
        <span className="thumb-notch" />
        <div className="thumb-screen">
          <span className="thumb-line w60" />
          <span className="thumb-line w40" />
          <span className="thumb-block" />
          <div className="thumb-row">
            <span />
            <span />
          </div>
          <span className="thumb-line w80" />
          <span className="thumb-line w50" />
        </div>
      </div>
      <span className="thumb-title">{project.title}</span>
    </div>
  )
}
