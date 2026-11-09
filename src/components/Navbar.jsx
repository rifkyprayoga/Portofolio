import { useEffect, useRef, useState } from 'react'
import { Menu, Music, X } from 'lucide-react'
import { useSound } from '../lib/sound'
import { useMusic } from '../lib/music'
import Logo from './Logo'

const links = [
  { name: 'Home', id: 'Home' },
  { name: 'About', id: 'About' },
  { name: 'Portfolio', id: 'Portofolio' },
  { name: 'Contact', id: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Home')
  const [open, setOpen] = useState(false)
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const linkRefs = useRef({})
  const { play } = useSound()
  const music = useMusic()
  const musicOn = music.status === 'playing'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const line = window.innerHeight * 0.38
      let current = links[0].id
      for (const l of links) {
        const el = document.getElementById(l.id)
        if (el && el.getBoundingClientRect().top <= line) current = l.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const update = () => {
      const el = linkRefs.current[active]
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [active])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    play('click')
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar-inner glass" aria-label="Navigasi utama">
        <a href="#Home" className="navbar-brand" onClick={go('Home')} aria-label="KYDEP — kembali ke beranda">
          <Logo />
        </a>

        <div className="navbar-links">
          <span className="navbar-pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} />
          {links.map((l) => (
            <a
              key={l.id}
              ref={(el) => (linkRefs.current[l.id] = el)}
              href={`#${l.id}`}
              className={`navbar-link ${active === l.id ? 'is-active' : ''}`}
              onClick={go(l.id)}
              onMouseEnter={() => play('hover')}
            >
              {l.name}
            </a>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            data-music-control
            className={`icon-btn music-toggle ${music.status === 'waiting' ? 'is-waiting' : ''}`}
            onClick={music.toggle}
            aria-label={musicOn ? 'Jeda musik' : 'Putar musik'}
            title={musicOn ? `Sedang diputar: ${music.nowPlaying?.title ?? 'musik latar'}` : 'Putar musik'}
          >
            {musicOn ? (
              <span className="eq is-playing" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <Music size={17} />
            )}
          </button>
          <button className="icon-btn navbar-toggle" onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        <div className="mobile-menu-panel glass" onClick={(e) => e.stopPropagation()}>
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`mobile-link ${active === l.id ? 'is-active' : ''}`}
              style={{ '--d': `${i * 60}ms` }}
              onClick={go(l.id)}
            >
              <span className="mobile-link-index">0{i + 1}</span>
              {l.name}
            </a>
          ))}
          <a href="#Contact" className="btn-primary mobile-cta" onClick={go('Contact')}>
            Hubungi Saya
          </a>
        </div>
      </div>
    </header>
  )
}
