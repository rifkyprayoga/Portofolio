import { useRef } from 'react'
import { profile } from '../data/profile'

// Potret About: foto utama, dan foto kedua "terintip" di lingkaran yang mengikuti kursor.
// Di HP: tekan & tahan jari di foto → lingkaran muncul di bawah jari (geser ke samping
// untuk menggerakkannya); angkat jari atau mulai scroll → kembali ke foto utama.
// Tanpa interaksi, foto kedua sesekali berkedip muncul.
export default function AboutPortrait() {
  const stageRef = useRef(null)
  const figureRef = useRef(null)
  const touching = useRef(false)

  const reveal = (e) => {
    const stage = stageRef.current
    const r = figureRef.current.getBoundingClientRect()
    stage.style.setProperty('--hover-x', `${((e.clientX - r.left) / r.width) * 100}%`)
    stage.style.setProperty('--hover-y', `${((e.clientY - r.top) / r.height) * 100}%`)
    stage.classList.add('is-revealing')
  }
  const hide = () => {
    touching.current = false
    stageRef.current.classList.remove('is-revealing')
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'touch') return
    touching.current = true
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
        <img
          className="about-portrait-img about-portrait-alt"
          src={profile.aboutPhotoAlt}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <span className="about-portrait-spark" aria-hidden="true" />
    </div>
  )
}
