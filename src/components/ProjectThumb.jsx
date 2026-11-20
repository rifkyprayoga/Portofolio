// Thumbnail proyek: gambar asli jika ada; jika tidak, mockup sesuai jenis proyek
// (project.kind: 'mobile' | 'web' | 'terminal' | 'desktop')

function PhoneMock() {
  return (
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
  )
}

function BrowserMock() {
  return (
    <div className="thumb-browser">
      <div className="thumb-browser-bar">
        <i />
        <i />
        <i />
        <span className="thumb-url" />
      </div>
      <div className="thumb-browser-body">
        <div className="thumb-hero">
          <span className="thumb-line w60" />
          <span className="thumb-line w40" />
          <span className="thumb-btn" />
        </div>
        <div className="thumb-cards">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

function TerminalMock({ lines = [] }) {
  return (
    <div className="thumb-term">
      <div className="thumb-term-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="thumb-term-body mono">
        {lines.map((l, i) => (
          <span key={i} className={l.startsWith('$') ? 'is-cmd' : l.startsWith('[OK]') ? 'is-ok' : ''}>
            {l}
          </span>
        ))}
        <span className="thumb-caret" />
      </div>
    </div>
  )
}

function DesktopMock({ lines = [] }) {
  return (
    <div className="thumb-desk">
      <div className="thumb-desk-video">
        <span className="thumb-avatar" />
        <span className="thumb-avatar" />
      </div>
      <div className="thumb-desk-panel">
        {lines.map((l, i) => (
          <span key={i} className={i % 2 === 0 ? 'is-label mono' : 'is-text'}>
            {l}
          </span>
        ))}
        <span className="thumb-line w80" />
        <span className="thumb-line w50" />
      </div>
    </div>
  )
}

export default function ProjectThumb({ project, large = false }) {
  if (project.image)
    return <img src={project.image} alt={`Tampilan ${project.title}`} className="thumb-img" loading="lazy" />

  const kind = project.kind || 'mobile'
  return (
    <div
      className={`thumb-mock kind-${kind} ${large ? 'is-large' : ''}`}
      style={{ background: project.gradient }}
      aria-hidden="true"
    >
      {kind === 'web' && <BrowserMock />}
      {kind === 'terminal' && <TerminalMock lines={project.preview} />}
      {kind === 'desktop' && <DesktopMock lines={project.preview} />}
      {kind === 'mobile' && <PhoneMock />}
      <span className="thumb-title">{project.title}</span>
    </div>
  )
}
