// Logo wordmark "KYDEP" (versi latar gelap): KY tebal + DEP tipis,
// garis bawah bergradasi, dan monogram kecil ".KD" di kanan bawah.
// Dibuat dengan teks + CSS (bukan gambar) supaya tajam di semua ukuran.
export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`.trim()} role="img" aria-label="KYDEP">
      <span className="logo-word" aria-hidden="true">
        <span className="logo-bold">KY</span>
        <span className="logo-thin">DEP</span>
      </span>
      <span className="logo-foot" aria-hidden="true">
        <span className="logo-line" />
        <span className="logo-dot" />
        <span className="logo-mono">
          <span className="logo-k">K</span>
          <span className="logo-d">D</span>
        </span>
      </span>
    </span>
  )
}
