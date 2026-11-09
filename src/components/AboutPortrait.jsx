import { useRef } from 'react'
import { profile } from '../data/profile'

// Potret About: foto utama, dan foto kedua "terintip" di lingkaran yang mengikuti kursor.
// Tanpa kursor, foto kedua sesekali berkedip muncul. Di layar sentuh: tap untuk berganti.
export default function AboutPortrait() {
  const stageRef = useRef(null)
  const figureRef = useRef(null)

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch') return
    const stage = stageRef.current
    const r = figureRef.current.getBoundingClientRect()
    stage.style.setProperty('--hover-x', `${((e.clientX - r.left) / r.width) * 100}%`)
    stage.style.setProperty('--hover-y', `${((e.clientY - r.top) / r.height) * 100}%`)
    stage.classList.add('is-revealing')
  }
  const onPointerLeave = (e) => {
    if (e.pointerType === 'touch') return
    stageRef.current.classList.remove('is-revealing')
  }
  const onPointerUp = (e) => {
    if (e.pointerType === 'touch') stageRef.current.classList.toggle('is-swapped')
  }

  return (
    <div
      className="about-portrait"
      ref={stageRef}
      data-reveal
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
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
