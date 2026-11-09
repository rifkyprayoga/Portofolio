import { profile } from '../data/profile'

// Foto profil; jika belum ada, tampilkan inisial bergradasi
export default function Avatar({ className = '' }) {
  if (profile.photo)
    return <img src={profile.photo} alt={profile.name} className={`avatar ${className}`} draggable="false" />
  return (
    <div className={`avatar avatar-fallback ${className}`} aria-hidden="true">
      {profile.initials}
    </div>
  )
}
