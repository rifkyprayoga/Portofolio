import { Code2, Cpu, FileText, Layers, Mail } from 'lucide-react'
import { experience, profile, projects, techStack } from '../data/profile'
import AboutPortrait from './AboutPortrait'

export default function About() {
  const techCount = new Set(techStack.flatMap((g) => g.skills.map((s) => s.name))).size
  const stats = [
    { icon: Code2, value: projects.length, label: 'Projek', sub: 'web & mobile' },
    { icon: Cpu, value: techCount, label: 'Teknologi', sub: 'yang dikuasai' },
    { icon: Layers, value: techStack.length, label: 'Bidang', sub: 'mobile → deploy' },
  ]

  return (
    <section className="section about" id="About" aria-labelledby="about-heading">
      <div className="container">
        <h2 className="section-title" id="about-heading" data-reveal>
          Tentang Saya
        </h2>
        <p className="section-sub" data-reveal>
          {profile.tagline}
        </p>

        <div className="about-grid">
          <AboutPortrait />

          <div className="about-copy">
            <h3 className="about-greeting" data-reveal>
              Halo, saya <span className="text-gradient">{profile.name}</span>
            </h3>
            {profile.bio.map((p, i) => (
              <p key={i} className="about-bio" data-reveal>
                {p}
              </p>
            ))}
            <div className="about-actions" data-reveal>
              {profile.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <FileText size={16} /> Download CV
                </a>
              )}
              <a href="#Contact" className="btn-secondary">
                <Mail size={15} /> Ajak Kolaborasi
              </a>
            </div>
          </div>
        </div>

        <div className="experience">
          <div className="experience-cols">
            {experience.map((g) => (
              <div key={g.group} className="experience-group" data-reveal>
                <h4 className="experience-group-title mono">{g.group}</h4>
                {g.items.map((it) => (
                  <article key={it.title + it.date} className="experience-card glass-card">
                    <div className="experience-logo">
                      {it.logo ? <img src={it.logo} alt="" /> : <span>{it.title.charAt(0)}</span>}
                    </div>
                    <div>
                      <h5>{it.title}</h5>
                      <p>{it.place}</p>
                      <span className="experience-date mono">{it.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>

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
