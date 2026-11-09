import { useEffect, useRef } from 'react'

// Latar: partikel bintang yang terhubung + meteor + bulatan cahaya
export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, particles, raf
    const mouse = { x: -9999, y: -9999 }

    // Dioptimalkan: resolusi 1×, 30fps, dan semua titik/garis digambar dalam beberapa path saja
    const FRAME_MS = 1000 / 30
    const BUCKETS = 4 // tingkat transparansi garis
    let last = 0

    const init = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
      }))
    }

    const draw = (now = 0) => {
      if (!reduce) raf = requestAnimationFrame(draw)
      if (!reduce && now - last < FRAME_MS) return
      const step = last ? Math.min(3, (now - last) / (1000 / 60)) : 1 // jaga kecepatan seperti 60fps
      last = now
      ctx.clearRect(0, 0, w, h)
      const link = 120
      const link2 = link * link
      const lines = Array.from({ length: BUCKETS }, () => new Path2D())
      const dots = new Path2D()
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx * step
        p.y += p.vy * step
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dxm = p.x - mouse.x
        const dym = p.y - mouse.y
        const dm2 = dxm * dxm + dym * dym
        if (dm2 < 140 * 140 && dm2 > 0) {
          const dm = Math.sqrt(dm2)
          p.x += (dxm / dm) * 0.6 * step
          p.y += (dym / dm) * 0.6 * step
        }
        dots.moveTo(p.x + p.r, p.y)
        dots.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < link2) {
            const k = Math.min(BUCKETS - 1, Math.floor((Math.sqrt(d2) / link) * BUCKETS))
            lines[k].moveTo(p.x, p.y)
            lines[k].lineTo(q.x, q.y)
          }
        }
      }
      ctx.lineWidth = 0.6
      for (let k = 0; k < BUCKETS; k++) {
        ctx.strokeStyle = `rgba(44, 103, 237, ${(0.22 * (1 - (k + 0.5) / BUCKETS)).toFixed(3)})`
        ctx.stroke(lines[k])
      }
      ctx.fillStyle = 'rgba(148, 197, 255, 0.7)'
      ctx.fill(dots)
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onResize = () => {
      init()
      if (reduce) draw()
    }
    init()
    draw()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />
      <div className="ambient-orb orb-c" />
      <canvas ref={canvasRef} className="particles-canvas" />
      <div className="meteors">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="meteor" style={{ '--i': i }} />
        ))}
      </div>
      <div className="bg-grid" />
    </div>
  )
}
