import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, CheckCircle2, ImagePlus, Loader2, MessageSquare, Send, UserRound, X } from 'lucide-react'
import { profile, socials } from '../data/profile'
import { AVATAR_BUCKET, supabase } from '../lib/supabase'
import { useSound } from '../lib/sound'
import BrandIcon from './BrandIcon'

const PAGE = 6
const COOLDOWN = 60 // detik antar komentar
const MAX_FILE = 5 * 1024 * 1024
const NOT_CONFIGURED = 'Supabase belum dikonfigurasi (isi .env).'

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'baru saja'
  if (s < 3600) return `${Math.floor(s / 60)} menit lalu`
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`
  if (s < 2592000) return `${Math.floor(s / 86400)} hari lalu`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function readCooldownEnd() {
  try {
    return Number(localStorage.getItem('comment-cooldown') || 0)
  } catch {
    return 0
  }
}

function ContactForm() {
  const { play } = useSound()
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState({ state: 'idle', msg: '' })

  const submit = async (e) => {
    e.preventDefault()
    if (form.website) return // honeypot: bot
    if (!supabase) return setStatus({ state: 'error', msg: NOT_CONFIGURED })
    setStatus({ state: 'loading', msg: '' })
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })
    if (error) {
      setStatus({ state: 'error', msg: 'Gagal mengirim pesan. Coba lagi sebentar.' })
      return
    }
    play('success')
    setForm({ name: '', email: '', message: '', website: '' })
    setStatus({ state: 'success', msg: 'Pesan berhasil dikirim. Terima kasih!' })
    setTimeout(() => setStatus({ state: 'idle', msg: '' }), 5000)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">
        <span>Nama</span>
        <input required maxLength={100} value={form.name} onChange={set('name')} placeholder="Nama kamu" autoComplete="name" />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          required
          type="email"
          maxLength={200}
          value={form.email}
          onChange={set('email')}
          placeholder="kamu@email.com"
          autoComplete="email"
        />
      </label>
      <label className="field">
        <span>Pesan</span>
        <textarea required maxLength={3000} rows={5} value={form.message} onChange={set('message')} placeholder="Ceritakan idemu..." />
      </label>
      <input className="hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden="true" />
      <button className="btn-primary btn-block" disabled={status.state === 'loading'}>
        {status.state === 'loading' ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
        {status.state === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
      {status.state === 'error' && <p className="form-error">{status.msg}</p>}
      {status.state === 'success' && (
        <p className="toast">
          <CheckCircle2 size={16} /> {status.msg}
        </p>
      )}
    </form>
  )
}

function Comments() {
  const { play } = useSound()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [cooldownEnd, setCooldownEnd] = useState(readCooldownEnd)
  const [now, setNow] = useState(() => Date.now())
  const fileRef = useRef(null)

  const remaining = Math.max(0, Math.ceil((cooldownEnd - now) / 1000))

  useEffect(() => {
    if (!remaining) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [remaining])

  const load = useCallback(async (offset = 0) => {
    if (!supabase) {
      setLoading(false)
      setLoadError(NOT_CONFIGURED)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('id, name, message, avatar_url, created_at')
      .eq('approved', true) // hanya komentar yang sudah kamu setujui (lihat 0002_comment_moderation.sql)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE)
    setLoading(false)
    if (error) {
      setLoadError('Komentar gagal dimuat.')
      return
    }
    setHasMore(data.length > PAGE)
    const page = data.slice(0, PAGE)
    setItems((prev) => (offset === 0 ? page : [...prev, ...page]))
  }, [])

  useEffect(() => {
    load(0)
  }, [load])

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const pickFile = (e) => {
    const f = e.target.files?.[0]
    setError('')
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('File harus berupa gambar.')
    if (f.size > MAX_FILE) return setError('Ukuran file maksimal 5 MB.')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const clearFile = () => {
    setFile(null)
    setPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!supabase) return setError(NOT_CONFIGURED)
    if (remaining) return
    setSending(true)
    setError('')
    let avatar_url = null
    if (file) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
      const path = `${crypto.randomUUID()}.${ext}`
      const up = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, { contentType: file.type })
      if (up.error) {
        setSending(false)
        return setError('Foto gagal diunggah.')
      }
      avatar_url = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl
    }
    // komentar baru menunggu persetujuan → tidak dibaca balik & tidak langsung ditampilkan
    const { error } = await supabase
      .from('comments')
      .insert({ name: name.trim(), message: message.trim(), avatar_url, approved: false })
    setSending(false)
    if (error) return setError('Komentar gagal dikirim. Coba lagi.')
    play('success')
    setNotice('Terima kasih! Komentarmu akan tampil setelah disetujui.')
    setTimeout(() => setNotice(''), 6000)
    setName('')
    setMessage('')
    clearFile()
    const end = Date.now() + COOLDOWN * 1000
    setCooldownEnd(end)
    setNow(Date.now())
    try {
      localStorage.setItem('comment-cooldown', String(end))
    } catch {
      /* abaikan */
    }
  }

  return (
    <div className="panel glass-card comments">
      <div className="comments-head">
        <span className="comments-icon">
          <MessageSquare size={18} />
        </span>
        <div>
          <h3>Buku Tamu</h3>
          <p>Tinggalkan jejak, saran, atau sekadar sapaan.</p>
        </div>
      </div>

      <form className="comment-form" onSubmit={submit}>
        <label className="field">
          <span>Nama</span>
          <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
        </label>
        <label className="field">
          <span>Komentar</span>
          <textarea
            required
            maxLength={500}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis komentar..."
          />
        </label>
        <div className="photo-picker">
          {preview ? (
            <div className="photo-preview">
              <img src={preview} alt="Pratinjau foto" />
              <button type="button" onClick={clearFile} aria-label="Hapus foto">
                <X size={12} />
              </button>
            </div>
          ) : (
            <button type="button" className="photo-btn" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={16} /> Foto Profil (opsional)
            </button>
          )}
          <span className="photo-hint">Ukuran file maksimal 5 MB</span>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickFile} />
        </div>
        <button className="btn-primary btn-block" disabled={sending || remaining > 0}>
          {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          {sending ? 'Mengirim...' : remaining ? `Tunggu ${remaining} detik` : 'Kirim Komentar'}
        </button>
        {remaining > 0 && (
          <div className="cooldown">
            <div className="cooldown-bar" style={{ transform: `scaleX(${remaining / COOLDOWN})` }} />
          </div>
        )}
        {error && <p className="form-error">{error}</p>}
        {notice && (
          <p className="toast">
            <CheckCircle2 size={16} /> {notice}
          </p>
        )}
      </form>

      <div className="comment-list">
        {items.map((c) => (
          <div key={c.id} className="comment">
            <div className="comment-avatar">
              {c.avatar_url ? <img src={c.avatar_url} alt="" loading="lazy" /> : <UserRound size={18} />}
            </div>
            <div className="comment-content">
              <div className="comment-meta">
                <strong>{c.name}</strong>
                <span>{timeAgo(c.created_at)}</span>
              </div>
              <p>{c.message}</p>
            </div>
          </div>
        ))}
        {loading &&
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="comment">
              <div className="comment-avatar skeleton" />
              <div className="comment-content" style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '85%' }} />
              </div>
            </div>
          ))}
        {!loading && loadError && <p className="comments-empty">{loadError}</p>}
        {!loading && !loadError && items.length === 0 && (
          <p className="comments-empty">Belum ada komentar. Jadilah yang pertama!</p>
        )}
        {!loading && hasMore && (
          <button className="btn-secondary btn-block" onClick={() => load(items.length)}>
            Muat lebih banyak
          </button>
        )}
      </div>
    </div>
  )
}

export default function Contact() {
  const { play } = useSound()
  const cards = [
    ...socials,
    ...(profile.email ? [{ id: 'email', label: 'Email', handle: profile.email, url: `mailto:${profile.email}` }] : []),
  ]
  return (
    <section className="section contact" id="Contact" aria-labelledby="contact-heading">
      <div className="container">
        <h2 className="section-title" id="contact-heading" data-reveal>
          Hubungi Saya
        </h2>
        <p className="section-sub" data-reveal>
          Ada ide aplikasi atau mau ngobrol soal proyek? Kirim pesan aja, saya balas secepatnya.
        </p>

        <div className="contact-grid">
          <div className="contact-left">
            <div className="panel glass-card" data-reveal>
              <h3 className="panel-title">Kirim Pesan</h3>
              <ContactForm />
            </div>
            <div className="panel glass-card" data-reveal>
              <h3 className="panel-title">Temukan saya di</h3>
              <div className="social-grid">
                {cards.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`social-card social-${s.id}`}
                    onMouseEnter={() => play('hover')}
                  >
                    <span className="social-card-icon">
                      <BrandIcon id={s.id} size={20} />
                    </span>
                    <span className="social-card-text">
                      <strong>{s.label}</strong>
                      <small>{s.handle}</small>
                    </span>
                    <ArrowUpRight size={16} className="social-card-arrow" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div data-reveal>
            <Comments />
          </div>
        </div>
      </div>
    </section>
  )
}
