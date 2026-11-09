import { Suspense, lazy, useEffect, useState } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { profile, socials } from '../data/profile'
import { useSound } from '../lib/sound'
import BrandIcon from './BrandIcon'

// Three.js cukup berat — muat lanyard 3D terpisah agar halaman cepat tampil
const Lanyard = lazy(() => import('./Lanyard'))

function useTypewriter(words) {
  const [text, setText] = useState('')
  useEffect(() => {
    let i = 0
    let len = 0
    let deleting = false
    let t
    const tick = () => {
      const word = words[i % words.length]
      len += deleting ? -1 : 1
      setText(word.slice(0, len))
      let delay = deleting ? 45 : 90
      if (!deleting && len === word.length) {
        deleting = true
        delay = 1800
      } else if (deleting && len === 0) {
        deleting = false
        i++
        delay = 350
      }
      t = setTimeout(tick, delay)
    }
    t = setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [words])
  return text
}

export default function Hero() {
  const typed = useTypewriter(profile.roles)
  const { play } = useSound()
  const [first, ...rest] = profile.name.split(' ')

  return (
    <section className="hero" id="Home">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow hero-intro" data-hero>
            <span className="pulse-dot" /> Tersedia untuk proyek baru
          </span>
          <h1 className="hero-title" data-hero>
            <span className="text-gradient">{first}</span>
            <span className="hero-title-rest">{rest.join(' ')}</span>
          </h1>
          <div className="hero-typewriter" data-hero>
            <span className="mono">&gt;_</span>
            <span>{typed}</span>
            <span className="cursor" />
          </div>
          <p className="hero-desc" data-hero>
            {profile.heroDescription}
          </p>
          <div className="hero-actions" data-hero>
            <a href="#Portofolio" className="btn-primary" onClick={() => play('click')} onMouseEnter={() => play('hover')}>
              Lihat Projek <ArrowUpRight size={16} />
            </a>
            <a href="#Contact" className="btn-secondary" onClick={() => play('click')} onMouseEnter={() => play('hover')}>
              Hubungi Saya <Mail size={15} />
            </a>
          </div>
          <div className="hero-socials" data-hero>
            <span className="hero-socials-label mono">Temukan saya</span>
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label={s.label}
                onMouseEnter={() => play('hover')}
              >
                <BrandIcon id={s.id} />
              </a>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <Suspense fallback={null}>
            <Lanyard />
          </Suspense>
        </div>
      </div>
      <a href="#About" className="scroll-cue" aria-label="Gulir ke bawah">
        <span />
      </a>
    </section>
  )
}
