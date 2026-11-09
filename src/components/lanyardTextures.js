import { profile, socials, techStack } from '../data/profile'

// Gambar depan 1696×2528 → tinggi gambar = lebar × 2528/1696.
// Di atas gambar ada strip kertas tipis supaya lubang tali (yang tergambar menempel
// ke tepi atas desain) tidak memotong tepi kartu.
const IMG_RATIO = 2528 / 1696
const TOP_STRIP = 0.07

// Ukuran kartu dalam satuan dunia 3D (1 satuan ≈ 100px di layar desktop)
export const CARD = {
  W: 2.4,
  H: 2.4 * IMG_RATIO + TOP_STRIP,
  R: 0.16, // radius sudut
  T: 0.035, // tebal inti (tanpa bevel)
  // lubang tali = posisi lubang hitam yang tergambar di desain (tengah, 0.068 dari atas gambar)
  SLOT_W: 0.54,
  SLOT_H: 0.115,
  SLOT_FROM_TOP: TOP_STRIP + 0.068,
}

const FACE_W = 1024
const FACE_H = Math.round((FACE_W * CARD.H) / CARD.W)
const PX = FACE_W / CARD.W // piksel tekstur per satuan dunia
const STRIP_PX = Math.round(TOP_STRIP * PX)

const PAPER = '#ebe3cc'
const PAPER_DARK = '#d8cfb4'
const NAVY = '#161c36'
const INK = '#0d0f1a'

const F_POSTER = 'Anton, Impact, "Arial Narrow", sans-serif'
const F_BODY = 'Inter, system-ui, sans-serif'

const loadImage = (src) =>
  src
    ? new Promise((resolve) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = src
      })
    : Promise.resolve(null)

// Tunggu font web + gambar depan supaya tekstur tidak memakai font/isi cadangan
export async function loadFaceAssets() {
  const fonts = [`400 100px ${F_POSTER}`, `400 32px ${F_BODY}`, `600 30px ${F_BODY}`]
  const front = loadImage(profile.lanyardFront)
  try {
    await Promise.all(fonts.map((f) => document.fonts.load(f)))
  } catch {
    // font gagal dimuat → tetap gambar dengan font sistem
  }
  return { front: await front }
}

// Generator acak sederhana (seed tetap → pola sama setiap render)
function rng(seed) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// Kertas krem + grid halus + garis bergelombang, seperti latar desain depan
function paper(ctx, w, h) {
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, w, h)
  const v = ctx.createRadialGradient(w / 2, h * 0.45, w * 0.3, w / 2, h * 0.45, w * 1.05)
  v.addColorStop(0, 'rgba(255, 252, 240, 0.35)')
  v.addColorStop(1, 'rgba(160, 150, 120, 0.28)')
  ctx.fillStyle = v
  ctx.fillRect(0, 0, w, h)

  ctx.lineWidth = 1
  for (let x = 0, i = 0; x <= w; x += 16, i++) {
    ctx.strokeStyle = i % 4 === 0 ? 'rgba(22, 28, 54, 0.10)' : 'rgba(22, 28, 54, 0.045)'
    ctx.beginPath()
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, h)
    ctx.stroke()
  }
  for (let y = 0, i = 0; y <= h; y += 16, i++) {
    ctx.strokeStyle = i % 4 === 0 ? 'rgba(22, 28, 54, 0.10)' : 'rgba(22, 28, 54, 0.045)'
    ctx.beginPath()
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(w, y + 0.5)
    ctx.stroke()
  }

  const rand = rng(11)
  ctx.strokeStyle = 'rgba(22, 28, 54, 0.16)'
  ctx.lineWidth = 2
  for (let k = 0; k < 16; k++) {
    const y0 = (k / 15) * h
    const a = 10 + rand() * 26
    const f = 0.004 + rand() * 0.006
    const ph = rand() * Math.PI * 2
    ctx.beginPath()
    for (let x = 0; x <= w; x += 12) {
      const y = y0 + Math.sin(x * f + ph) * a + Math.sin(x * f * 2.3 + ph * 1.7) * a * 0.35
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  for (let k = 0; k < 11; k++) {
    const x0 = (k / 10) * w
    const a = 12 + rand() * 30
    const f = 0.003 + rand() * 0.005
    const ph = rand() * Math.PI * 2
    ctx.beginPath()
    for (let y = 0; y <= h; y += 12) {
      const x = x0 + Math.sin(y * f + ph) * a
      if (y === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

// Lubang tali hitam seperti di desain depan (lubang 3D dipotong tepat di atasnya)
function slotPill(ctx, w) {
  const pw = 0.559 * PX
  const ph = 0.125 * PX
  const cy = CARD.SLOT_FROM_TOP * PX
  ctx.fillStyle = '#111111'
  ctx.beginPath()
  ctx.roundRect(w / 2 - pw / 2, cy - ph / 2, pw, ph, ph / 2)
  ctx.fill()
}

function fitFont(ctx, text, maxWidth, family, size, weight = '400') {
  let s = size
  ctx.font = `${weight} ${s}px ${family}`
  while (ctx.measureText(text).width > maxWidth && s > 16) {
    s -= 2
    ctx.font = `${weight} ${s}px ${family}`
  }
  return s
}

// Bingkai garis tipis dengan titik bulat di sudut (motif desain depan)
function dotFrame(ctx, x, y, w, h) {
  ctx.strokeStyle = NAVY
  ctx.lineWidth = 3
  ctx.strokeRect(x, y, w, h)
  ctx.fillStyle = NAVY
  for (const [px, py] of [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ]) {
    ctx.beginPath()
    ctx.arc(px, py, 13, 0, Math.PI * 2)
    ctx.fill()
  }
}

function labelBox(ctx, text, x, y, size = 46) {
  ctx.font = `400 ${size}px ${F_POSTER}`
  const tw = ctx.measureText(text).width
  const padX = size * 0.5
  const bh = size * 1.45
  ctx.fillStyle = NAVY
  ctx.fillRect(x, y, tw + padX * 2, bh)
  ctx.fillStyle = PAPER
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(text, x + padX, y + bh / 2 + 2)
  return { w: tw + padX * 2, h: bh }
}

export function drawCardFront(canvas, assets = {}) {
  canvas.width = FACE_W
  canvas.height = FACE_H
  const ctx = canvas.getContext('2d')
  const w = FACE_W
  const h = FACE_H
  if (assets.front) {
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, w, STRIP_PX + 2)
    ctx.drawImage(assets.front, 0, STRIP_PX, w, h - STRIP_PX)
    return
  }
  // sementara gambar dimuat / gagal dimuat
  paper(ctx, w, h)
  slotPill(ctx, w)
  ctx.fillStyle = NAVY
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  fitFont(ctx, 'DEVELOPER', w - 120, F_POSTER, 220)
  ctx.fillText('DEVELOPER', w / 2, h * 0.3)
  fitFont(ctx, profile.name.toUpperCase(), w - 160, F_POSTER, 80)
  ctx.fillText(profile.name.toUpperCase(), w / 2, h * 0.55)
}

export function drawCardBack(canvas) {
  canvas.width = FACE_W
  canvas.height = FACE_H
  const ctx = canvas.getContext('2d')
  const w = FACE_W
  const h = FACE_H
  paper(ctx, w, h)
  slotPill(ctx, w)

  // label atas kiri + garis penghubung (seperti "JUNIOR" di depan)
  const top = 150
  const box = labelBox(ctx, 'ABOUT ME', 96, top, 50)
  ctx.strokeStyle = NAVY
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(96 + box.w, top + box.h / 2)
  ctx.lineTo(560, top + box.h / 2)
  ctx.lineTo(560, top + box.h + 40)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(560, top + box.h + 40, 8, 0, Math.PI * 2)
  ctx.fillStyle = NAVY
  ctx.fill()

  // kanan atas: tahun & lokasi
  ctx.textAlign = 'right'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = NAVY
  ctx.font = `400 58px ${F_POSTER}`
  ctx.fillText(`ID · ${new Date().getFullYear()}`, w - 90, top + 50)
  ctx.font = `600 26px ${F_BODY}`
  ctx.fillText(profile.location.toUpperCase(), w - 92, top + 86)

  // judul besar dalam bingkai bertitik
  const fy = 280
  const fh = 210
  dotFrame(ctx, 56, fy, w - 112, fh)
  ctx.fillStyle = NAVY
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  fitFont(ctx, 'PROFILE', w - 190, F_POSTER, 200)
  ctx.fillText('PROFILE', w / 2, fy + fh / 2 + 8)

  // stiker nama, sedikit miring
  const name = profile.name.toUpperCase()
  ctx.save()
  ctx.translate(w / 2, fy + fh + 62)
  ctx.rotate(-0.025)
  const ns = fitFont(ctx, name, w - 260, F_POSTER, 72)
  const nw = ctx.measureText(name).width + 70
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetY = 6
  ctx.fillStyle = '#f4efdf'
  ctx.fillRect(-nw / 2, -ns * 0.78, nw, ns * 1.56)
  ctx.shadowColor = 'transparent'
  ctx.fillStyle = INK
  ctx.fillText(name, 0, 4)
  ctx.restore()

  // tagline
  let y = fy + fh + 165
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `400 32px ${F_BODY}`
  ctx.fillStyle = 'rgba(22, 28, 54, 0.88)'
  const left = 96
  const colW = 600
  const words = profile.tagline.split(' ')
  let line = ''
  let lines = 0
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > colW && line) {
      ctx.fillText(line, left, y)
      line = word
      y += 44
      if (++lines === 3) {
        line = ''
        break
      }
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, left, y)

  // tech stack
  y += 40
  labelBox(ctx, 'TECH STACK', left, y, 36)
  y += 70
  ctx.font = `600 27px ${F_BODY}`
  const skills = techStack.flatMap((g) => g.skills.map((s) => s.name)).slice(0, 12)
  let cx = left
  let rows = 0
  for (const s of skills) {
    const cw = ctx.measureText(s).width + 36
    if (cx + cw > left + colW) {
      cx = left
      y += 58
      if (++rows === 4) break
    }
    ctx.strokeStyle = NAVY
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.roundRect(cx, y, cw, 48, 24)
    ctx.stroke()
    ctx.fillStyle = NAVY
    ctx.fillText(s, cx + 18, y + 34)
    cx += cw + 12
  }

  // kontak
  y += 80
  labelBox(ctx, 'FIND ME', left, y, 36)
  y += 56
  for (const s of socials.slice(0, 3)) {
    y += 42
    ctx.font = `400 32px ${F_POSTER}`
    ctx.fillStyle = NAVY
    ctx.fillText(s.label.toUpperCase(), left, y)
    ctx.font = `400 28px ${F_BODY}`
    ctx.fillText(s.handle, left + 210, y)
  }

  // kolom kanan: teks vertikal dalam bingkai bertitik (seperti "MOBILE DEVELOPER")
  const vx = 760
  const vy = fy + fh + 150
  const vw = 180
  const bandY = h - 230
  const vh = bandY - vy - 50
  dotFrame(ctx, vx, vy, vw, vh)
  ctx.save()
  ctx.translate(vx + vw / 2, vy + vh / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = NAVY
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const vText = 'FLUTTER · KOTLIN'
  fitFont(ctx, vText, vh - 60, F_POSTER, 130)
  ctx.fillText(vText, 0, 6)
  ctx.restore()

  // pita navy di bawah (seperti "PORTFOLIO" di depan)
  ctx.fillStyle = NAVY
  ctx.fillRect(0, bandY, w, h - bandY)
  ctx.fillStyle = PAPER
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  fitFont(ctx, 'THANK YOU', 430, F_POSTER, 130)
  ctx.fillText('THANK YOU', 60, bandY + (h - bandY) / 2 + 4)
  // motif per (lingkaran berderet)
  ctx.strokeStyle = 'rgba(235, 227, 204, 0.55)'
  ctx.lineWidth = 2
  for (let i = 0; i < 9; i++) {
    ctx.beginPath()
    ctx.ellipse(572 + i * 11, bandY + (h - bandY) / 2, 26, 34, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.font = `400 32px ${F_BODY}`
  ctx.fillStyle = PAPER
  ctx.fillText("Let's build", 720, bandY + (h - bandY) / 2 - 22)
  ctx.fillText('something great', 720, bandY + (h - bandY) / 2 + 22)
}

// Tekstur pita tali: memanjang (v berulang), teks berjalan sepanjang tali
export const STRAP_TEX_RATIO = 8 // panjang satu ulangan tekstur = lebar tali × 8
export function drawStrap(canvas) {
  const w = 128
  const h = w * STRAP_TEX_RATIO
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, w, h)
  const g = ctx.createLinearGradient(0, 0, w, 0)
  g.addColorStop(0, 'rgba(0, 0, 0, 0.25)')
  g.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0.25)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // jahitan tepi
  ctx.fillStyle = 'rgba(235, 227, 204, 0.6)'
  for (let y = 0; y < h; y += 16) {
    ctx.fillRect(9, y, 3, 9)
    ctx.fillRect(w - 12, y, 3, 9)
  }

  ctx.save()
  ctx.translate(w / 2, 0)
  ctx.rotate(Math.PI / 2)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillStyle = PAPER
  fitFont(ctx, profile.name.toUpperCase(), h * 0.44, F_POSTER, 54)
  ctx.fillText(profile.name.toUpperCase(), h * 0.25, 2)
  fitFont(ctx, 'JUNIOR DEVELOPER', h * 0.44, F_POSTER, 54)
  ctx.fillText('JUNIOR DEVELOPER', h * 0.75, 2)
  ctx.font = `400 34px ${F_POSTER}`
  ctx.fillStyle = PAPER_DARK
  ctx.fillText('✦', h * 0.5, 2)
  ctx.fillText('✦', 0, 2)
  ctx.fillText('✦', h, 2)
  ctx.restore()
}
