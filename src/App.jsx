import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from './data/profile'
import { SoundProvider } from './lib/sound'
import { MusicProvider } from './lib/music'
import WelcomeScreen from './components/WelcomeScreen'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Soundtrack from './components/Soundtrack'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectDetail from './components/ProjectDetail'

gsap.registerPlugin(ScrollTrigger)

const projectIdFrom = (path) => {
  const m = path.match(/^\/project\/([^/]+)\/?$/)
  return m ? decodeURIComponent(m[1]) : null
}

function Home({ onOpenProject }) {
  // animasi masuk hero + reveal saat scroll
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', { y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 })
      gsap.from('.hero-visual', { y: -60, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)', delay: 0.3 })
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      gsap.to('.orb-a', { yPercent: 60, ease: 'none', scrollTrigger: { scrub: 1 } })
      gsap.to('.orb-b', { yPercent: -50, ease: 'none', scrollTrigger: { scrub: 1 } })
      gsap.to('.hero-copy', {
        yPercent: -12,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Soundtrack />
      <Portfolio onOpenProject={onOpenProject} />
      <Contact />
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [path, setPath] = useState(window.location.pathname)
  const projectId = projectIdFrom(path)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!projectId) document.title = `${profile.name} | Portofolio`
  }, [projectId])

  // setelah loader selesai, lompat ke #hash bila ada (mis. /#Portofolio)
  useEffect(() => {
    if (!ready || projectId) return
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    ScrollTrigger.refresh()
  }, [ready, projectId])

  const openProject = useCallback((id) => {
    history.pushState({ fromPortfolio: true }, '', `/project/${encodeURIComponent(id)}`)
    setPath(window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  const backToPortfolio = useCallback(() => {
    if (history.state?.fromPortfolio) {
      history.back()
      setTimeout(() => document.getElementById('Portofolio')?.scrollIntoView(), 50)
    } else {
      history.pushState({}, '', '/#Portofolio')
      setPath('/')
      requestAnimationFrame(() => document.getElementById('Portofolio')?.scrollIntoView())
    }
  }, [])

  const done = useCallback(() => setReady(true), [])

  return (
    <SoundProvider>
      <MusicProvider active={ready}>
        {!ready && <WelcomeScreen onDone={done} />}
        <Background />
        {ready && (
          <div className="app">
            {projectId ? (
              <ProjectDetail id={projectId} onBack={backToPortfolio} />
            ) : (
              <>
                <Navbar />
                <Home onOpenProject={openProject} />
              </>
            )}
            <Footer />
          </div>
        )}
      </MusicProvider>
    </SoundProvider>
  )
}
