import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { profile } from '../data/profile'
import { useSound } from '../lib/sound'
import { CARD, STRAP_TEX_RATIO, drawCardBack, drawCardFront, drawStrap, loadFaceAssets } from './lanyardTextures'

// ---------- konstanta fisika & bentuk ----------
const SEG = 10 // jumlah ruas tali
const SUB_DT = 1 / 120 // langkah simulasi tetap
const GRAVITY = 38
const BREEZE = 0.6
const STRAP_W = 0.34
const CLIP_H = 0.3
const BEVEL = 0.012
const RING_R = 0.15
const SLOT_Y = CARD.H / 2 - CARD.SLOT_FROM_TOP
const RING_Y = SLOT_Y + RING_R - 0.02 // ring melewati lubang tali
const HANG_Y = RING_Y + RING_R // titik gantung (atas ring), koordinat lokal kartu
const RIBBON_N = 64
const TWIST_K = 30 // pegas putaran kartu (untuk efek balik)
const TWIST_DAMP = 3.2
const TAU = Math.PI * 2

function roundedRect(path, x, y, w, h, r) {
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.quadraticCurveTo(x + w, y, x + w, y + r)
  path.lineTo(x + w, y + h - r)
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  path.lineTo(x + r, y + h)
  path.quadraticCurveTo(x, y + h, x, y + h - r)
  path.lineTo(x, y + r)
  path.quadraticCurveTo(x, y, x + r, y)
}

function cardShape() {
  const b = BEVEL
  const s = new THREE.Shape()
  roundedRect(s, -CARD.W / 2 + b, -CARD.H / 2 + b, CARD.W - b * 2, CARD.H - b * 2, CARD.R - b)
  const hole = new THREE.Path()
  const hw = CARD.SLOT_W + b * 2
  const hh = CARD.SLOT_H + b * 2
  // radius < setengah tinggi: sisi lurus sepanjang 0 membuat triangulasi berlubang
  roundedRect(hole, -hw / 2, SLOT_Y - hh / 2, hw, hh, hh * 0.42)
  s.holes.push(hole)
  return s
}

function buildCardGeometry() {
  const shape = cardShape()
  const body = new THREE.ExtrudeGeometry(shape, {
    depth: CARD.T,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 4,
    curveSegments: 24,
  })
  body.translate(0, 0, -CARD.T / 2)
  const face = new THREE.ShapeGeometry(shape, 24)
  const pos = face.getAttribute('position')
  const uv = face.getAttribute('uv')
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + CARD.W / 2) / CARD.W, (pos.getY(i) + CARD.H / 2) / CARD.H)
  }
  uv.needsUpdate = true
  return { body, face }
}

function buildClipGeometry() {
  const s = new THREE.Shape()
  const w = 0.36
  roundedRect(s, -w / 2, -CLIP_H / 2, w, CLIP_H, 0.06)
  const hole = new THREE.Path()
  roundedRect(hole, -0.1, -CLIP_H / 2 + 0.05, 0.2, 0.06, 0.025)
  s.holes.push(hole)
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 4,
    curveSegments: 12,
  })
  g.translate(0, 0, -0.025)
  return g
}

// Lingkungan pantulan gelap dengan beberapa panel cahaya → kilap tegas tanpa membuat kartu pucat
function buildEnvScene() {
  const env = new THREE.Scene()
  env.background = new THREE.Color(0.02, 0.025, 0.04)
  const plane = new THREE.PlaneGeometry(1, 1)
  const panel = (intensity, color, pos, scale, rot = 0) => {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(plane.clone(), mat)
    mesh.position.set(...pos)
    mesh.scale.set(scale[0], scale[1], 1)
    mesh.lookAt(0, 0, 0)
    mesh.rotateZ(rot)
    env.add(mesh)
  }
  panel(2.2, 0xffffff, [0, 4.5, 8], [9, 3]) // softbox atas-depan
  panel(3.5, 0xffffff, [-5.5, 0.5, 7], [0.8, 14]) // strip kiri
  panel(2.2, 0x60a5fa, [5, -0.5, 8], [0.6, 14]) // strip kanan kebiruan
  panel(1.6, 0xffffff, [0, -1, 9], [24, 0.3], Math.PI / 3) // garis kilap diagonal
  panel(0.5, 0x2c67ed, [0, -7, 1], [16, 6]) // pantulan bawah biru
  plane.dispose()
  return env
}

function buildRibbonGeometry() {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RIBBON_N * 2 * 3), 3))
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(RIBBON_N * 2 * 3), 3))
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(RIBBON_N * 2 * 2), 2))
  const idx = []
  for (let i = 0; i < RIBBON_N - 1; i++) {
    const a = i * 2
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  g.setIndex(idx)
  return g
}

// Kartu ID 3D yang tergantung tali — bisa ditarik, dilempar, dan dibalik dengan klik
export default function Lanyard() {
  const stageRef = useRef(null)
  const flipRef = useRef(null)
  const { play } = useSound()
  const playRef = useRef(play)
  useEffect(() => {
    playRef.current = play
  }, [play])

  useEffect(() => {
    const stage = stageRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      // WebGL tidak tersedia → tampilkan kartu statis
      const img = document.createElement('canvas')
      img.className = 'lanyard-fallback'
      drawCardFront(img)
      stage.prepend(img)
      loadFaceAssets().then((a) => drawCardFront(img, a))
      return () => img.remove()
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    const canvas = renderer.domElement
    canvas.className = 'lanyard-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    stage.prepend(canvas)

    // ---------- scene ----------
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = buildEnvScene()
    const envTex = pmrem.fromScene(envScene, 0.04).texture
    envScene.traverse((o) => {
      o.geometry?.dispose()
      o.material?.dispose()
    })
    pmrem.dispose()
    scene.environment = envTex

    const FOV = 22
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200)
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(-2.5, 4, 6)
    const fill = new THREE.DirectionalLight(0xffffff, 0.35)
    fill.position.set(3, -1, 4)
    const rim = new THREE.DirectionalLight(0x3b82f6, 1.4)
    rim.position.set(4, 3, -4)
    scene.add(key, fill, rim)

    // ---------- tekstur ----------
    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    const makeTex = (c) => {
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = aniso
      return t
    }
    const frontCanvas = document.createElement('canvas')
    const backCanvas = document.createElement('canvas')
    const strapCanvas = document.createElement('canvas')
    drawCardFront(frontCanvas)
    drawCardBack(backCanvas)
    drawStrap(strapCanvas)
    const frontTex = makeTex(frontCanvas)
    const backTex = makeTex(backCanvas)
    const strapTex = makeTex(strapCanvas)
    strapTex.wrapT = THREE.RepeatWrapping

    // ---------- material ----------
    const faceProps = {
      roughness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 0.08,
      iridescenceIOR: 1.3,
      envMapIntensity: 0.6,
      // wajah kartu menempel di badan kartu → dorong ke depan di depth buffer (cegah z-fighting)
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }
    const frontMat = new THREE.MeshPhysicalMaterial({ map: frontTex, ...faceProps })
    const backMat = new THREE.MeshPhysicalMaterial({ map: backTex, ...faceProps })
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x161c36,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    })
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd9dce2, metalness: 1, roughness: 0.18 })
    const strapMat = new THREE.MeshStandardMaterial({
      map: strapTex,
      roughness: 0.75,
      envMapIntensity: 0.5,
      side: THREE.DoubleSide,
    })

    // ---------- mesh ----------
    const { body: bodyGeo, face: faceGeo } = buildCardGeometry()
    const faceZ = CARD.T / 2 + BEVEL + 0.001
    const card = new THREE.Group()
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    const frontMesh = new THREE.Mesh(faceGeo, frontMat)
    frontMesh.position.z = faceZ
    const backMesh = new THREE.Mesh(faceGeo, backMat)
    backMesh.rotation.y = Math.PI
    backMesh.position.z = -faceZ
    const ringGeo = new THREE.TorusGeometry(RING_R, 0.022, 16, 64)
    const ring = new THREE.Mesh(ringGeo, metalMat)
    ring.rotation.y = Math.PI / 2
    ring.position.y = RING_Y
    card.add(bodyMesh, frontMesh, backMesh, ring)
    scene.add(card)
    const hitMeshes = [bodyMesh, frontMesh, backMesh]

    const clipGeo = buildClipGeometry()
    const clip = new THREE.Mesh(clipGeo, metalMat)
    scene.add(clip)

    const ribbonGeo = buildRibbonGeometry()
    const ribbon = new THREE.Mesh(ribbonGeo, strapMat)
    ribbon.frustumCulled = false
    scene.add(ribbon)

    // ---------- state fisika (Verlet) ----------
    const nodes = Array.from({ length: SEG + 1 }, () => ({ p: new THREE.Vector3(), q: new THREE.Vector3(), w: 1 }))
    nodes[0].w = 0
    nodes[SEG].w = 0.5
    const body = { p: new THREE.Vector3(), q: new THREE.Vector3(), w: 0.25 } // pusat kartu
    const anchor = new THREE.Vector3()
    let rest = 0.3
    let reach = 4
    let ppu = 100
    let laidOut = false
    let yaw = 0
    let yawVel = 0
    let turn = 0
    let grab = null
    const grabTarget = new THREE.Vector3()

    const curve = new THREE.CatmullRomCurve3(
      nodes.map((n) => n.p),
      false,
      'centripetal',
    )

    const tmp = new THREE.Vector3()
    const integrate = (n, dt, damp, ax, az) => {
      tmp.subVectors(n.p, n.q).multiplyScalar(damp)
      tmp.z *= 0.985
      const max = 60 * dt
      if (tmp.lengthSq() > max * max) tmp.setLength(max)
      n.q.copy(n.p)
      n.p.add(tmp)
      n.p.x += ax * dt * dt
      n.p.y -= GRAVITY * dt * dt
      n.p.z += az * dt * dt
    }
    // tali hanya menahan tarikan (boleh kendur), sedikit elastis
    const tension = (a, b, len, stiff) => {
      tmp.subVectors(b.p, a.p)
      const d = tmp.length()
      const wsum = a.w + b.w
      if (d <= len || d < 1e-9 || wsum === 0) return
      const k = ((d - len) / d / wsum) * stiff
      a.p.addScaledVector(tmp, k * a.w)
      b.p.addScaledVector(tmp, -k * b.w)
    }
    const rigid = (a, b, len, bw) => {
      tmp.subVectors(b.p, a.p)
      const d = tmp.length()
      const wsum = a.w + bw
      if (d < 1e-9 || wsum === 0) return
      const k = (d - len) / d / wsum
      a.p.addScaledVector(tmp, k * a.w)
      b.p.addScaledVector(tmp, -k * bw)
    }

    const resetState = (intro) => {
      for (let i = 0; i <= SEG; i++) {
        const n = nodes[i]
        n.p.copy(anchor)
        if (intro) {
          n.p.x += rest * i * 0.8
          n.p.y -= rest * i * 0.55
        } else {
          n.p.y -= rest * i
        }
        n.q.copy(n.p)
      }
      body.p.copy(nodes[SEG].p)
      body.p.y -= HANG_Y
      body.q.copy(body.p)
      yaw = 0
      yawVel = 0
      turn = 0
    }

    const simulate = (dt, t) => {
      const bx = reduce ? 0 : BREEZE * (Math.sin(t * 0.53) * 0.7 + Math.sin(t * 1.31 + 1.7) * 0.3) * 3
      const bz = reduce ? 0 : BREEZE * Math.sin(t * 0.37 + 0.6) * 2
      const nodeDamp = Math.exp(-1.6 * dt)
      const bodyDamp = Math.exp(-0.6 * dt)
      for (let i = 1; i <= SEG; i++) integrate(nodes[i], dt, nodeDamp, bx, bz)
      const prevX = body.p.x
      if (grab) {
        body.q.copy(body.p)
        body.p.lerp(grabTarget, 1 - Math.exp(-35 * dt))
      } else {
        integrate(body, dt, bodyDamp, bx * 0.35, bz * 0.35)
      }
      const bw = grab ? 0 : body.w
      for (let k = 0; k < 16; k++) {
        for (let i = 0; i < SEG; i++) tension(nodes[i], nodes[i + 1], rest, 0.9)
        rigid(nodes[SEG], body, HANG_Y, bw)
      }
      // putaran kartu pada sumbu tali (pegas menuju sisi depan/belakang)
      yawVel += ((turn - yaw) * TWIST_K - yawVel * TWIST_DAMP) * dt
      yawVel += (body.p.x - prevX) * 0.15
      yawVel += bx * 0.02 * dt
      yaw += yawVel * dt
      if (Math.abs(turn) >= TAU - 1e-6 && Math.abs(turn - yaw) < 0.02 && Math.abs(yawVel) < 0.05) {
        const wrap = Math.round(turn / TAU) * TAU
        turn -= wrap
        yaw -= wrap
      }
    }

    // ---------- render ----------
    const Z = new THREE.Vector3(0, 0, 1)
    const up = new THREE.Vector3()
    const right0 = new THREE.Vector3(1, 0, 0)
    const lastRight = new THREE.Vector3(1, 0, 0)
    const normal0 = new THREE.Vector3()
    const right = new THREE.Vector3()
    const normal = new THREE.Vector3()
    const basis = new THREE.Matrix4()
    const pt = new THREE.Vector3()
    const tan = new THREE.Vector3()
    const toCam = new THREE.Vector3()
    const acr = new THREE.Vector3()
    const prevAcr = new THREE.Vector3()
    const side = new THREE.Vector3()
    const across = new THREE.Vector3()
    const nrm = new THREE.Vector3()
    const clipUp = new THREE.Vector3()
    const clipX = new THREE.Vector3()
    const clipZ = new THREE.Vector3()

    const updateCard = () => {
      up.subVectors(nodes[SEG].p, body.p).normalize()
      right0.crossVectors(up, Z)
      if (right0.lengthSq() < 1e-4) right0.copy(lastRight)
      right0.normalize()
      lastRight.copy(right0)
      normal0.crossVectors(right0, up)
      const c = Math.cos(yaw)
      const s = Math.sin(yaw)
      right.copy(right0).multiplyScalar(c).addScaledVector(normal0, -s)
      normal.copy(right0).multiplyScalar(s).addScaledVector(normal0, c)
      basis.makeBasis(right, up, normal)
      card.quaternion.setFromRotationMatrix(basis)
      card.position.copy(body.p)
    }

    const updateStrap = () => {
      curve.updateArcLengths()
      const total = curve.getLength()
      const uEnd = Math.max(0.05, 1 - (CLIP_H * 0.55) / Math.max(total, 1e-3))
      const posA = ribbonGeo.getAttribute('position')
      const norA = ribbonGeo.getAttribute('normal')
      const uvA = ribbonGeo.getAttribute('uv')
      const half = STRAP_W / 2
      const vScale = 1 / (STRAP_W * STRAP_TEX_RATIO)
      for (let i = 0; i < RIBBON_N; i++) {
        const f = i / (RIBBON_N - 1)
        const u = f * uEnd
        curve.getPointAt(u, pt)
        curve.getTangentAt(u, tan)
        toCam.subVectors(camera.position, pt).normalize()
        acr.crossVectors(tan, toCam)
        if (acr.lengthSq() < 1e-8) acr.copy(prevAcr)
        acr.normalize()
        if (i > 0 && acr.dot(prevAcr) < 0) acr.negate()
        prevAcr.copy(acr)
        // pelintiran tali mengikuti putaran kartu, makin kuat ke ujung bawah
        const tw = yaw * Math.pow(f, 1.6)
        side.crossVectors(acr, tan)
        across.copy(acr).multiplyScalar(Math.cos(tw)).addScaledVector(side, Math.sin(tw))
        nrm.crossVectors(across, tan).normalize()
        const a = i * 2
        posA.setXYZ(a, pt.x - across.x * half, pt.y - across.y * half, pt.z - across.z * half)
        posA.setXYZ(a + 1, pt.x + across.x * half, pt.y + across.y * half, pt.z + across.z * half)
        norA.setXYZ(a, nrm.x, nrm.y, nrm.z)
        norA.setXYZ(a + 1, nrm.x, nrm.y, nrm.z)
        const v = u * total * vScale
        uvA.setXY(a, 0, v)
        uvA.setXY(a + 1, 1, v)
      }
      posA.needsUpdate = true
      norA.needsUpdate = true
      uvA.needsUpdate = true

      // klip logam di ujung tali, menghadap searah pita
      clipUp.copy(tan).negate().normalize()
      clipX.copy(across).addScaledVector(clipUp, -across.dot(clipUp)).normalize()
      clipZ.crossVectors(clipX, clipUp)
      basis.makeBasis(clipX, clipUp, clipZ)
      clip.quaternion.setFromRotationMatrix(basis)
      clip.position.copy(nodes[SEG].p).addScaledVector(clipUp, CLIP_H / 2)
    }

    const render = () => {
      updateCard()
      updateStrap()
      renderer.render(scene, camera)
    }

    // ---------- ukuran & kamera ----------
    // Kanvas menutupi seluruh section hero (tidak menangkap klik), supaya tali turun dari
    // atas layar dan kartu bebas diayun tanpa terpotong tepi kolom.
    const host = stage.closest('section') || stage
    const layout = () => {
      const sr = stage.getBoundingClientRect()
      const hr = host.getBoundingClientRect()
      const w = Math.max(1, Math.round(hr.width))
      const hTot = Math.max(1, Math.round(hr.height))
      canvas.style.left = `${hr.left - sr.left}px`
      canvas.style.top = `${hr.top - sr.top}px`
      canvas.style.width = `${w}px`
      canvas.style.height = `${hTot}px`
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)) // 1.5× cukup tajam, jauh lebih ringan dari 2×
      renderer.setSize(w, hTot, false)

      const colW = Math.max(1, sr.width)
      ppu = Math.min(colW < 480 ? 80 : 100, colW / (CARD.W * 1.3))
      const Hw = hTot / ppu
      camera.aspect = w / hTot
      const camDist = Hw / 2 / Math.tan((FOV * Math.PI) / 360)
      camera.position.set(0, 0, camDist)
      // rentang near–far sempit di sekitar kartu = presisi depth tinggi
      camera.near = camDist * 0.5
      camera.far = camDist * 1.5
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()

      const oldAnchor = anchor.clone()
      // titik gantung: tengah kolom kanan, sedikit di atas tepi atas section
      const ax = (sr.left + sr.width / 2 - (hr.left + hr.width / 2)) / ppu
      anchor.set(ax, Hw / 2 + 0.4, 0)
      const bottom = Hw / 2 - (sr.bottom - hr.top) / ppu + 56 / ppu // sisakan ruang untuk teks petunjuk
      const centerY = bottom + CARD.H / 2 + BEVEL
      const L = Math.max(1.2, anchor.y - (centerY + HANG_Y))
      rest = L / SEG
      reach = (L + HANG_Y) * 1.12

      if (!laidOut) {
        resetState(!reduce)
        laidOut = true
      } else {
        // geser seluruh tali mengikuti titik gantung baru (tanpa reset gerakan)
        const d = anchor.clone().sub(oldAnchor)
        for (const n of nodes) {
          n.p.add(d)
          n.q.add(d)
        }
        body.p.add(d)
        body.q.add(d)
      }
      render()
    }

    // ---------- interaksi ----------
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const setRay = (e) => {
      const r = canvas.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
    }
    const hitCard = () => {
      card.updateMatrixWorld(true)
      return raycaster.intersectObjects(hitMeshes, false)[0] || null
    }
    let lastInteract = 0

    const flip = (dir = 1) => {
      turn += Math.PI * dir
      yawVel += 3.5 * dir
      lastInteract = performance.now()
      wake()
    }
    flipRef.current = flip

    const onDown = (e) => {
      if (e.button > 0) return
      setRay(e)
      const hit = hitCard()
      if (!hit) return
      grab = {
        off: hit.point.clone().sub(body.p),
        z: hit.point.z,
        x: e.clientX,
        y: e.clientY,
        t: e.timeStamp, // waktu kejadian asli — tidak terpengaruh kerja berat di thread utama
        tap: true,
        // sisi yang diklik menentukan arah putaran
        dir: hit.point.x >= body.p.x ? 1 : -1,
      }
      grabTarget.copy(body.p)
      host.setPointerCapture?.(e.pointerId)
      host.style.cursor = 'grabbing'
      lastInteract = performance.now()
      playRef.current('click')
      e.preventDefault()
      wake()
    }
    const onMove = (e) => {
      setRay(e)
      if (grab) {
        if (Math.hypot(e.clientX - grab.x, e.clientY - grab.y) > 6) grab.tap = false
        const ray = raycaster.ray
        if (Math.abs(ray.direction.z) > 1e-6) {
          const t = (grab.z - ray.origin.z) / ray.direction.z
          grabTarget.copy(ray.direction).multiplyScalar(t).add(ray.origin).sub(grab.off)
          tmp.subVectors(grabTarget, anchor)
          if (tmp.length() > reach) grabTarget.copy(anchor).addScaledVector(tmp.normalize(), reach)
        }
        lastInteract = performance.now()
        wake()
      } else if (e.pointerType !== 'touch') {
        host.style.cursor = hitCard() ? 'grab' : ''
      }
    }
    const onUp = (e) => {
      if (!grab) return
      const tapped = grab.tap && e.type === 'pointerup' && e.timeStamp - grab.t < 450
      const dir = grab.dir
      grab = null
      if (host.hasPointerCapture?.(e.pointerId)) host.releasePointerCapture(e.pointerId)
      host.style.cursor = e.pointerType === 'touch' ? '' : 'grab'
      if (tapped) flip(dir)
      wake()
    }
    // cegah scroll halaman hanya saat jari menyentuh kartu
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return
      setRay(e.touches[0])
      if (hitCard()) e.preventDefault()
    }

    host.addEventListener('pointerdown', onDown)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerup', onUp)
    host.addEventListener('pointercancel', onUp)
    host.addEventListener('lostpointercapture', onUp)
    host.addEventListener('touchstart', onTouchStart, { passive: false })

    // ---------- loop ----------
    let alive = true
    let raf = 0
    let last = null
    let acc = 0
    let time = 0
    let visible = true
    let nextAuto = 7 + Math.random() * 5

    const isCalm = () => {
      if (grab || Math.abs(turn - yaw) > 0.01 || Math.abs(yawVel) > 0.01) return false
      if (body.p.distanceToSquared(body.q) > 1e-8) return false
      return nodes.every((n) => n.p.distanceToSquared(n.q) < 1e-8)
    }

    const frame = () => {
      raf = 0
      // pakai performance.now(): timestamp rAF tidak selalu bertambah dengan andal
      const now = performance.now()
      const dt = last === null ? 1 / 60 : Math.min(0.05, Math.max(0, (now - last) / 1000))
      last = now
      acc += dt
      let steps = 0
      while (acc >= SUB_DT && steps < 8) {
        simulate(SUB_DT, time)
        time += SUB_DT
        acc -= SUB_DT
        steps++
      }
      if (steps === 8) acc = 0
      // sesekali kartu berputar sendiri memperlihatkan sisi belakang
      if (!reduce && !grab && time > nextAuto) {
        if (performance.now() - lastInteract > 6000 && turn === Math.round(turn / TAU) * TAU) {
          const dir = Math.random() < 0.5 ? -1 : 1
          turn += TAU * dir
          yawVel += 4 * dir
        }
        nextAuto = time + 10 + Math.random() * 10
      }
      render()
      // tanpa angin (reduced motion) loop berhenti saat kartu diam
      if (reduce && isCalm()) return
      if (alive && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    function wake() {
      if (!raf && alive && visible && !document.hidden) {
        last = null
        raf = requestAnimationFrame(frame)
      }
    }

    const ro = new ResizeObserver(layout)
    ro.observe(stage)
    if (host !== stage) ro.observe(host)
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting
      wake()
    })
    io.observe(stage)
    const onVisibility = () => wake()
    document.addEventListener('visibilitychange', onVisibility)

    layout()
    wake()

    loadFaceAssets().then((assets) => {
      if (!alive) return
      drawCardFront(frontCanvas, assets)
      drawCardBack(backCanvas)
      drawStrap(strapCanvas)
      frontTex.needsUpdate = true
      backTex.needsUpdate = true
      strapTex.needsUpdate = true
      render()
    })

    return () => {
      alive = false
      flipRef.current = null
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerup', onUp)
      host.removeEventListener('pointercancel', onUp)
      host.removeEventListener('lostpointercapture', onUp)
      host.removeEventListener('touchstart', onTouchStart)
      host.style.cursor = ''
      ;[bodyGeo, faceGeo, ringGeo, clipGeo, ribbonGeo].forEach((g) => g.dispose())
      ;[frontMat, backMat, bodyMat, metalMat, strapMat].forEach((m) => m.dispose())
      ;[frontTex, backTex, strapTex, envTex].forEach((t) => t.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      flipRef.current?.(1)
    }
  }

  return (
    <div
      className="lanyard"
      ref={stageRef}
      tabIndex={0}
      role="button"
      aria-label={`Kartu ID ${profile.name}, ${profile.role}. Tekan Enter untuk membalik kartu.`}
      onKeyDown={onKeyDown}
    >
      <p className="lanyard-hint" aria-hidden="true">
        tarik · klik untuk membalik
      </p>
    </div>
  )
}
