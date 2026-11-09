// =========================================================
// SEMUA KONTEN SITUS ADA DI FILE INI.
// Bagian bertanda TODO masih placeholder — ganti dengan data aslimu.
// =========================================================

const icon = (path) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${path}.svg`

export const profile = {
  name: 'Rifky Deby Prayoga',
  shortName: 'Rifky',
  initials: 'RD',
  role: 'Mobile Developer',
  // Teks yang berganti-ganti di hero
  roles: ['Mobile Developer', 'Flutter Developer', 'Android Enthusiast', 'Fullstack Learner'],
  tagline: 'Membangun aplikasi mobile yang cepat, rapi, dan enak dipakai setiap hari.',
  heroDescription:
    'Dengan Flutter, Kotlin, dan teknologi web modern, saya mengubah ide menjadi aplikasi yang intuitif, responsif, dan benar-benar dipakai orang.',
  // Taruh fotomu di /public/images/profile.jpg lalu isi: '/images/profile.jpg'
  photo: '', // TODO
  // Desain sisi depan kartu lanyard (rasio ±1696×2528, lubang tali tergambar di tengah atas)
  lanyardFront: '/images/lanyard-front.jpg',
  // Potret About (latar transparan, ukuran & posisi wajah sama) — foto kedua muncul saat kursor lewat
  aboutPhoto: '/images/about-me.webp',
  aboutPhotoAlt: '/images/about-batman.webp',
  location: 'Indonesia', // TODO
  email: '', // TODO: isi untuk menampilkan kartu email di kontak
  bio: [
    // TODO: tulis ulang dengan kalimatmu sendiri
    'Halo! Saya Rifky, seorang mobile developer yang suka mengubah ide menjadi aplikasi yang nyaman digunakan. Fokus saya ada di pengembangan aplikasi Android & lintas platform.',
    'Selain mobile, saya juga membangun web dan backend — mulai dari dashboard admin, toko online, sampai integrasi database — supaya aplikasi yang saya buat lengkap dari depan sampai belakang.',
  ],
  cvUrl: '', // TODO: link CV (Google Drive / PDF di /public)
}

// Musik latar: lagu pembuka (public/audio) diputar dulu, setelah selesai lanjut ke playlist YouTube Music
export const music = {
  playlistId: 'PLbn-n1cJVDqQ',
  playlistUrl: 'https://music.youtube.com/playlist?list=PLbn-n1cJVDqQ',
  playlistName: 'nyantuy',
  introAudio: '/audio/intro.mp3', // lagu pembuka, diputar sekali saat web dibuka
}

export const socials = [
  { id: 'instagram', label: 'Instagram', handle: '@rfkydep', url: 'https://www.instagram.com/rfkydep/' },
  { id: 'facebook', label: 'Facebook', handle: 'Rifky D. Prayoga', url: 'https://www.facebook.com/rifky.d.prayoga00' },
  { id: 'github', label: 'GitHub', handle: 'rifkyprayoga', url: 'https://github.com/rifkyprayoga' },
]

// Pendidikan & pengalaman (title = tempat, place = peran / jurusan)
export const experience = [
  {
    group: 'Pengalaman',
    items: [
      { title: 'Iwan Tirta', place: 'Office Boy', date: '2020', logo: '' },
      { title: 'Paket Nasi', place: 'UI/UX Designer', date: '2021', logo: '' },
      { title: 'Gerutas', place: 'Full-Stack Developer | Web Designer | Content Creator', date: '2022', logo: '' },
      { title: 'IconPlus', place: 'Tukang Lap Kaca Gedung | Office Boy', date: '2022 – Sekarang', logo: '' },
    ],
  },
  {
    group: 'Pendidikan',
    items: [{ title: 'Universitas Amikom', place: 'Teknik Pengendalian Anu', date: '2021', logo: '' }],
  },
]

export const projects = [
  {
    id: 'daya-pustaka',
    title: 'Daya Pustaka',
    category: 'Web App',
    gradient: 'linear-gradient(135deg, #0b1530 0%, #1e3a8a 55%, #2c67ed 100%)',
    image: '', // opsional: '/images/projects/daya-pustaka.png'
    description: 'Situs penerbit & toko buku lengkap dengan katalog, checkout, lacak pesanan, dan dashboard admin.',
    longDesc:
      'Daya Pustaka adalah situs penerbit dan toko buku yang dibangun dengan Next.js dan Supabase. Pengunjung bisa menjelajah katalog dengan filter, memesan buku, melacak pesanan, hingga mengirim naskah. Di sisi admin tersedia dashboard untuk mengelola buku, pesanan (stok otomatis), naskah masuk, reseller, dan konten beranda — semua perubahan langsung tampil di situs.',
    tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    repo: 'https://github.com/rifkyprayoga/daya-pustaka',
    demo: '',
  },
  {
    // TODO: contoh — ganti dengan proyek mobile aslimu
    id: 'kasir-mobile',
    title: 'Aplikasi Kasir Mobile',
    category: 'Mobile',
    gradient: 'linear-gradient(135deg, #04121f 0%, #075985 55%, #00b4d8 100%)',
    image: '',
    description: 'Aplikasi kasir Android untuk UMKM: transaksi cepat, stok barang, dan laporan harian.',
    longDesc:
      'Contoh deskripsi panjang. Ceritakan masalah yang diselesaikan, fitur utama, peranmu, dan hasilnya (misalnya jumlah pengguna atau waktu yang dihemat).',
    tags: ['Flutter', 'Dart', 'Firebase', 'Android Studio'],
    repo: '',
    demo: '',
  },
  {
    // TODO: contoh — ganti dengan proyek mobile aslimu
    id: 'absensi-app',
    title: 'Absensi Berbasis Lokasi',
    category: 'Mobile',
    gradient: 'linear-gradient(135deg, #0a0f2c 0%, #3730a3 55%, #60a5fa 100%)',
    image: '',
    description: 'Aplikasi absensi dengan validasi GPS dan foto selfie, terhubung ke dashboard admin.',
    longDesc:
      'Contoh deskripsi panjang. Ceritakan masalah yang diselesaikan, fitur utama, peranmu, dan hasilnya.',
    tags: ['Kotlin', 'Supabase', 'Android Studio', 'Git'],
    repo: '',
    demo: '',
  },
]

export const techStack = [
  {
    category: 'Mobile Development',
    skills: [
      { name: 'Flutter', logo: icon('flutter/flutter-original') },
      { name: 'Dart', logo: icon('dart/dart-original') },
      { name: 'Kotlin', logo: icon('kotlin/kotlin-original') },
      { name: 'React Native', logo: icon('react/react-original') },
      { name: 'Android Studio', logo: icon('androidstudio/androidstudio-original') },
    ],
  },
  {
    category: 'Frontend Development',
    skills: [
      { name: 'React', logo: icon('react/react-original') },
      { name: 'JavaScript', logo: icon('javascript/javascript-original') },
      { name: 'HTML5', logo: icon('html5/html5-original') },
      { name: 'CSS3', logo: icon('css3/css3-original') },
    ],
  },
  {
    category: 'Backend & Database',
    skills: [
      { name: 'Python', logo: icon('python/python-original') },
      { name: 'PHP', logo: icon('php/php-original') },
      { name: 'MySQL', logo: icon('mysql/mysql-original') },
      { name: 'Supabase', logo: icon('supabase/supabase-original') },
      { name: 'Firebase', logo: icon('firebase/firebase-original') },
    ],
  },
  {
    category: 'Tools & Deploy',
    skills: [
      { name: 'Git', logo: icon('git/git-original') },
      { name: 'GitHub', logo: icon('github/github-original') },
      { name: 'Vite', logo: icon('vitejs/vitejs-original') },
      { name: 'Vercel', logo: icon('vercel/vercel-original') },
    ],
  },
]

// Taruh gambar sertifikat di /public/images/certificates/ — TODO
// contoh: { title: 'Belajar Flutter Dasar', issuer: 'Dicoding', year: '2025', image: '/images/certificates/flutter.jpg' }
export const certificates = []

// contoh: { title: 'Juara 2 Lomba Aplikasi Mobile', issuer: 'Nama Penyelenggara', year: '2025', image: '' }
export const awards = []
