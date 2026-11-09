import { ArrowUp } from 'lucide-react'
import { profile, socials } from '../data/profile'
import BrandIcon from './BrandIcon'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <div>
              <strong>{profile.name}</strong>
              <p>{profile.tagline}</p>
            </div>
          </div>
          <div className="footer-col">
            <span className="footer-heading mono">Navigasi</span>
            <a href="#Home">Beranda</a>
            <a href="#About">Tentang Saya</a>
            <a href="#Portofolio">Portofolio</a>
            <a href="#Contact">Kontak</a>
          </div>
          <div className="footer-col">
            <span className="footer-heading mono">Terhubung</span>
            <div className="footer-socials">
              {socials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="social-btn" aria-label={s.label}>
                  <BrandIcon id={s.id} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.name}. Dibuat dengan React & secangkir kopi.
          </span>
          <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Kembali ke Atas <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
