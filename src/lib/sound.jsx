import { createContext, useCallback, useContext, useRef } from 'react'

const SoundContext = createContext(null)

// Tombol nyala/mati suara sudah dihapus → suara selalu nyala.
// Bersihkan pilihan lama ("off") yang mungkin masih tersimpan di browser.
try {
  localStorage.removeItem('sound')
} catch {
  /* abaikan */
}
const soundEnabled = true

// Efek suara kecil yang dibuat langsung dengan Web Audio (tanpa file mp3)
export function SoundProvider({ children }) {
  const ctxRef = useRef(null)

  const play = useCallback(
    (type = 'click') => {
      try {
        if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        const ctx = ctxRef.current
        if (ctx.state === 'suspended') ctx.resume()
        const t = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const presets = {
          click: { f1: 880, f2: 520, dur: 0.08, vol: 0.05, wave: 'triangle' },
          hover: { f1: 1400, f2: 1200, dur: 0.035, vol: 0.015, wave: 'sine' },
          success: { f1: 660, f2: 1320, dur: 0.22, vol: 0.05, wave: 'sine' },
          toggle: { f1: 440, f2: 880, dur: 0.12, vol: 0.04, wave: 'square' },
        }
        const p = presets[type] || presets.click
        osc.type = p.wave
        osc.frequency.setValueAtTime(p.f1, t)
        osc.frequency.exponentialRampToValueAtTime(p.f2, t + p.dur)
        gain.gain.setValueAtTime(p.vol, t)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + p.dur)
        osc.connect(gain).connect(ctx.destination)
        osc.start(t)
        osc.stop(t + p.dur + 0.02)
      } catch {
        /* browser tanpa Web Audio */
      }
    },
    [],
  )

  return <SoundContext.Provider value={{ soundEnabled, play }}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)
