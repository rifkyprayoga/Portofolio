import { ArrowUp } from 'lucide-react'
import { profile, socials } from '../data/profile'
import BrandIcon from './BrandIcon'
import Logo from './Logo'
import { useLang } from '../lib/i18n'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { t, tx } = useLang()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <div>
              <strong>{profile.name}</strong>
              <p>{tx(profile.tagline)}</p>
            </div>
          </div>
          <div className="footer-col">
            <span className="footer-heading mono">{t('footer.nav')}</span>
            <a href="#Home">{t('footer.home')}</a>
            <a href="#About">{t('footer.about')}</a>
            <a href="#Portofolio">{t('footer.portfolio')}</a>
            <a href="#Contact">{t('footer.contact')}</a>
          </div>
          <div className="footer-col">
            <span className="footer-heading mono">{t('footer.connect')}</span>
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
            © {YEAR} {profile.name}. {t('footer.made')}
          </span>
          <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {t('footer.top')} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
