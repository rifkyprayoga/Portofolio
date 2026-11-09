// Logo wordmark "RFKYDEP" (versi latar gelap): RFKY tebal + DEP tipis,
// garis bawah bergradasi, dan monogram kecil ".RD" di kanan bawah.
// Dibuat dengan teks + CSS (bukan gambar) supaya tajam di semua ukuran.
export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`.trim()} role="img" aria-label="RFKYDEP">
      <span className="logo-word" aria-hidden="true">
        <span className="logo-bold">RFKY</span>
        <span className="logo-thin">DEP</span>
      </span>
      <span className="logo-foot" aria-hidden="true">
        <span className="logo-line" />
        <span className="logo-dot" />
        <span className="logo-rd">
          <span className="logo-r">R</span>
          <span className="logo-d">D</span>
        </span>
      </span>
    </span>
  )
}
