import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'

// Potret About: foto utama, dan foto kedua "terintip" di lingkaran (lensa) yang mengikuti kursor.
// Di HP: tekan & tahan jari di foto → lensa muncul di bawah jari (geser ke samping
// untuk menggerakkannya); angkat jari atau mulai scroll → kembali ke foto utama.
// Tanpa interaksi, foto kedua sesekali berkedip muncul.
//
// Performa: lensa hanya digeser dengan transform (dikerjakan GPU, tanpa menggambar ulang foto),
// paling banyak sekali per frame, dan ukuran foto hanya diukur saat sentuhan/kursor baru masuk.
const R = 120 // jari-jari lensa (px) — samakan dengan .about-portrait-lens di CSS

export default function AboutPortrait() {
  const stageRef = useRef(null)
  const figureRef = useRef(null)
  const lensRef = useRef(null)
  const lensImgRef = useRef(null)
  const touching = useRef(false)
  const rect = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  // posisi foto berubah saat scroll / resize → ukur ulang di sentuhan berikutnya
  useEffect(() => {
    const reset = () => (rect.current = null)
    window.addEventListener('scroll', reset, { passive: true })
    window.addEventListener('resize', reset)
    return () => {
      window.removeEventListener('scroll', reset)
      window.removeEventListener('resize', reset)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const apply = () => {
    raf.current = 0
    const { x, y } = pos.current
    lensRef.current.style.transform = `translate3d(${x - R}px, ${y - R}px, 0)`
    lensImgRef.current.style.transform = `translate3d(${R - x}px, ${R - y}px, 0)`
  }

  const reveal = (e) => {
    if (!rect.current) {
      const r = figureRef.current.getBoundingClientRect()
      rect.current = r
      // foto di dalam lensa harus seukuran foto utama
      lensImgRef.current.style.width = `${r.width}px`
      lensImgRef.current.style.height = `${r.height}px`
    }
    pos.current = { x: e.clientX - rect.current.left, y: e.clientY - rect.current.top }
    if (!raf.current) raf.current = requestAnimationFrame(apply)
    stageRef.current.classList.add('is-revealing')
  }
  const hide = () => {
    touching.current = false
    stageRef.current.classList.remove('is-revealing')
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'touch') return
    touching.current = true
    rect.current = null
    reveal(e)
  }
  const onPointerMove = (e) => {
    // mouse: ikuti kursor; jari: hanya selama masih menempel di foto
    if (e.pointerType === 'touch' && !touching.current) return
    reveal(e)
  }
  const onPointerUp = (e) => {
    if (e.pointerType === 'touch') hide()
  }

  return (
    <div
      className="about-portrait"
      ref={stageRef}
      data-reveal
      onPointerEnter={() => (rect.current = null)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={hide}
      onPointerLeave={hide}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="about-portrait-orbits" aria-hidden="true">
        <span className="orbit orbit-1" />
        <span className="orbit orbit-2" />
      </div>
      <div className="about-portrait-glow" />
      <div className="about-portrait-figure" ref={figureRef}>
        <img
          className="about-portrait-img about-portrait-main"
          src={profile.aboutPhoto}
          alt={profile.name}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        {/* foto kedua penuh: hanya untuk efek berkedip saat tidak disentuh */}
        <img
          className="about-portrait-img about-portrait-alt"
          src={profile.aboutPhotoAlt}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        <div className="about-portrait-lens" ref={lensRef} aria-hidden="true">
          <img ref={lensImgRef} src={profile.aboutPhotoAlt} alt="" decoding="async" draggable="false" />
        </div>
      </div>
      <span className="about-portrait-spark" aria-hidden="true" />
    </div>
  )
}
