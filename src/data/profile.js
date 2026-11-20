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

// kind menentukan bentuk thumbnail jika belum ada screenshot:
//   'web' = jendela browser · 'mobile' = ponsel · 'terminal' = konsol · 'desktop' = aplikasi desktop
// preview = baris teks yang tampil di thumbnail terminal / desktop
// badge   = label kecil di kartu (mis. 'Proyek Kantor'), note = catatan di halaman detail
export const projects = [
  {
    id: 'absensi-siswa',
    title: 'PresensiKu — Absensi Siswa',
    category: 'Mobile App',
    kind: 'mobile',
    year: '2026',
    role: 'Full-Stack Developer',
    gradient: 'linear-gradient(135deg, #04121f 0%, #0f4c81 50%, #0d9488 100%)',
    image: '',
    description:
      'Sistem presensi sekolah: aplikasi Android untuk siswa & guru dengan QR dinamis, selfie + deteksi wajah, dan GPS, plus dashboard web.',
    longDesc:
      'Penulisan ulang aplikasi presensi lama (Yii2) menjadi dua bagian: backend Laravel 13 + Filament 5 sebagai dashboard admin/guru sekaligus REST API, dan aplikasi Android native Kotlin + Jetpack Compose. Guru membuka sesi lalu menampilkan QR yang berganti tiap 30 detik, sehingga foto QR yang dibagikan ke teman tidak bisa dipakai. Server memeriksa token, kelas, radius GPS, lokasi palsu, dan presensi ganda, lalu menentukan status Hadir/Terlambat/Alpa secara otomatis.',
    highlights: [
      'QR dinamis berganti tiap 30 detik + validasi geofence & deteksi lokasi palsu',
      'Selfie gerbang dengan ML Kit Face Detection (1 wajah + deteksi kedipan)',
      'Riwayat kalender, rekap PDF, pengajuan izin dengan lampiran, kartu pelajar digital ber-QR',
      'Sesi presensi dibuat otomatis tiap malam; siswa yang tidak hadir ditandai Alpa saat sesi ditutup',
      'Notifikasi latar belakang dengan WorkManager',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Laravel', 'Filament', 'ML Kit', 'REST API', 'MySQL'],
    repo: '',
    demo: '',
  },
  {
    id: 'daya-pustaka',
    title: 'Daya Pustaka',
    category: 'Web App',
    kind: 'web',
    year: '2026',
    role: 'Full-Stack Developer',
    gradient: 'linear-gradient(135deg, #0b1530 0%, #1e3a8a 55%, #2c67ed 100%)',
    image: '', // opsional: '/images/projects/daya-pustaka.png'
    description: 'Situs penerbit & toko buku lengkap dengan katalog, checkout, lacak pesanan, dan dashboard admin.',
    longDesc:
      'Daya Pustaka adalah situs penerbit dan toko buku yang dibangun dengan Next.js dan Supabase. Pengunjung bisa menjelajah katalog dengan filter, memesan buku, melacak pesanan, hingga mengirim naskah. Di sisi admin tersedia dashboard untuk mengelola buku, pesanan, naskah masuk, reseller, dan konten beranda — semua perubahan langsung tampil di situs.',
    highlights: [
      'Katalog dengan filter kategori / seri / label / pencarian, halaman buku ber-SEO (Open Graph & schema.org)',
      'Keranjang → checkout; harga & stok dihitung di database, bukan di browser',
      'Lacak pesanan dan kirim naskah lewat tautan Google Drive',
      'Dashboard admin: alur status pesanan, stok otomatis, resi, pesan WhatsApp siap kirim',
      'Kurasi naskah, persetujuan reseller, dan pengaturan konten beranda',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    repo: '',
    demo: '',
  },
  {
    id: 'meeting-assistant',
    title: 'Asisten Meeting AI',
    category: 'AI & Desktop',
    kind: 'desktop',
    year: '2026',
    role: 'Developer',
    gradient: 'linear-gradient(135deg, #0d0a24 0%, #4c1d95 55%, #2c67ed 100%)',
    image: '',
    description:
      'Asisten untuk meeting online: transkrip, terjemahan otomatis, dan saran jawaban real-time dengan Gemini.',
    longDesc:
      'Program Windows yang mendengarkan meeting online (Zoom, Google Meet, dll.) tanpa perlu memasukkan bot ke ruang meeting. Suara lawan bicara diambil dari audio speaker (WASAPI loopback) dan suara sendiri dari mikrofon, dipotong per ucapan, lalu dikirim ke Gemini untuk ditranskrip, diterjemahkan, dan dibuatkan saran jawaban sesuai konteks yang ditulis pengguna.',
    highlights: [
      'Tangkap audio dua arah: loopback speaker + mikrofon',
      'Pemotongan audio per ucapan berdasarkan jeda hening',
      'Transkrip, terjemahan (deteksi bahasa otomatis), dan saran jawaban',
      'File konteks pribadi agar jawaban sesuai situasi, tanpa mengarang fakta',
      'Overlay desktop (PySide6) dan dibundel jadi .exe dengan PyInstaller',
    ],
    tags: ['Python', 'Gemini API', 'PySide6', 'WASAPI', 'PyInstaller'],
    repo: '',
    demo: '',
    preview: ['Lawan bicara', 'Can you walk me through it?', 'Terjemahan', 'Bisa jelaskan alurnya?', 'Saran jawaban'],
  },
  {
    id: 'forex-bot',
    title: 'Forex Trend Bot',
    category: 'Otomasi & Bot',
    kind: 'terminal',
    year: '2026',
    role: 'Developer',
    gradient: 'linear-gradient(135deg, #021208 0%, #064e3b 55%, #10b981 100%)',
    image: '',
    description:
      'Bot trading MetaTrader 5 dengan backtest, riset strategi in-sample vs out-of-sample, dan rem risiko berlapis.',
    longDesc:
      'Bot trend-following untuk MetaTrader 5. Logika sinyal yang sama dipakai untuk backtest dan live, sehingga hasil uji tidak berbeda dengan yang dijalankan. Tujuh keluarga strategi dibandingkan secara in-sample dan out-of-sample sebelum dipilih. Bot berjalan dalam mode dry-run secara default dan dilengkapi rem risiko otomatis.',
    highlights: [
      'Satu modul strategi untuk backtest & live (identik)',
      'Riset 7 keluarga strategi dengan validasi out-of-sample',
      'Risiko 2% per posisi, stop entry saat rugi harian ≥ 6% atau drawdown ≥ 35%',
      'Mode DRY_RUN default, auto-restart saat crash, notifikasi',
    ],
    tags: ['Python', 'MetaTrader 5', 'pandas', 'NumPy', 'Backtesting'],
    repo: '',
    demo: '',
    preview: [
      '$ python backtest.py --tf H4',
      'Strategi : trend-following',
      'Risiko   : 2% / posisi',
      'Mode     : DRY_RUN',
      '[OK] Sinyal identik backtest & live',
    ],
  },
  {
    id: 'crypto-bot',
    title: 'Crypto Paper Trading Bot',
    category: 'Otomasi & Bot',
    kind: 'terminal',
    year: '2026',
    role: 'Developer',
    gradient: 'linear-gradient(135deg, #140a02 0%, #7c2d12 55%, #f59e0b 100%)',
    image: '',
    description:
      'Bot paper trading BTC/ETH/SOL dari data Indodax dengan strategi Donchian breakout, notifikasi Telegram, dan dashboard.',
    longDesc:
      'Bot untuk menguji strategi crypto tanpa uang sungguhan. Data diambil dari Indodax (data publik), lalu strategi Donchian breakout dijalankan pada BTC/IDR, ETH/IDR, dan SOL/IDR dengan modal dibagi rata. Dilengkapi backtest, optimasi parameter, notifikasi Telegram, dan dashboard web sederhana untuk memantau equity.',
    highlights: [
      'Backtest + optimasi parameter dengan data historis 2 tahun',
      'Paper trading timeframe 4 jam, tiga koin sekaligus',
      'Notifikasi Telegram: BUY/SELL, ringkasan harian, peringatan error',
      'Dashboard monitoring equity berbasis web',
      'Autostart di Windows lewat skrip PowerShell',
    ],
    tags: ['Python', 'ccxt', 'pandas', 'Telegram Bot', 'Backtesting'],
    repo: '',
    demo: '',
    preview: [
      '$ python paper_trade.py',
      'Pair : BTC/IDR ETH/IDR SOL/IDR',
      'TF   : 4h · Donchian 120/40',
      '[BUY] ETH/IDR breakout',
      '[TG] Notifikasi terkirim',
    ],
  },
  {
    id: 'rekap-multi-db',
    title: 'Rekap Data Multi-Database',
    category: 'Otomasi & Bot',
    kind: 'terminal',
    year: '2026',
    role: 'Developer',
    badge: 'Proyek Kantor',
    gradient: 'linear-gradient(135deg, #04101f 0%, #1e3a8a 55%, #0ea5e9 100%)',
    image: '',
    description:
      'Skrip yang menarik data dari banyak database PostgreSQL secara paralel lalu menggabungkannya jadi satu laporan Excel.',
    longDesc:
      'Alat bantu rekap data layanan yang tersebar di beberapa database regional. Koneksi database dibaca otomatis dari file .env (DB1, DB2, … DBn), query dijalankan paralel ke semua database, lalu hasilnya digabung menjadi satu file Excel siap pakai. Pekerjaan yang sebelumnya dilakukan manual per database kini selesai dalam satu perintah.',
    highlights: [
      'Deteksi otomatis semua koneksi database dari .env',
      'Query paralel dengan ThreadPoolExecutor',
      'Penggabungan hasil dengan pandas dan ekspor ke Excel',
    ],
    tags: ['Python', 'PostgreSQL', 'pandas', 'openpyxl'],
    repo: '',
    demo: '',
    note: 'Alat internal — kode sumber tidak dipublikasikan.',
    preview: ['$ python rekap.py', '[..] DB1 … DB6 terdeteksi', '[OK] Query paralel selesai', '[OK] rekap.xlsx dibuat'],
  },
  {
    id: 'paket-nasi-marketing',
    title: 'Paket Nasi Marketing',
    category: 'Mobile App',
    kind: 'mobile',
    year: '2021',
    role: 'UI/UX Designer',
    gradient: 'linear-gradient(135deg, #1a0a02 0%, #9a3412 55%, #fb923c 100%)',
    image: '',
    description:
      'Aplikasi Android untuk jaringan marketing & afiliasi Paket Nasi: komisi, jaringan agen, transaksi, dan materi promosi.',
    longDesc:
      'Aplikasi Android untuk tim marketing Paket Nasi. Pengguna bisa memantau jaringan agen dan katering di bawahnya, komisi, pencapaian, riwayat transaksi, serta mengunduh materi promosi. Saya terlibat di sisi desain antarmuka dan alur pengguna.',
    highlights: [
      'Struktur jaringan marketing bertingkat (agen & katering)',
      'Komisi, pencapaian, dan riwayat transaksi',
      'Banner, materi promosi, dan pesan masuk',
      'Notifikasi push dengan Firebase Cloud Messaging',
    ],
    tags: ['Kotlin', 'Android', 'Retrofit', 'Firebase', 'UI/UX'],
    repo: '',
    demo: '',
  },
  {
    id: 'ecommerce-app',
    title: 'Aplikasi E-Commerce',
    category: 'Mobile App',
    kind: 'mobile',
    year: '2024',
    role: 'Android Developer',
    gradient: 'linear-gradient(135deg, #0a0f2c 0%, #3730a3 55%, #60a5fa 100%)',
    image: '',
    description: 'Aplikasi belanja Android dengan onboarding, login/registrasi, dan katalog produk dari Firebase.',
    longDesc:
      'Aplikasi e-commerce Android yang dibangun dengan Kotlin. Alurnya dimulai dari halaman pengenalan, pilihan akun, login dan registrasi, lalu masuk ke halaman belanja. Data produk diambil dari Firebase Realtime Database dan gambar dimuat dengan Glide.',
    highlights: [
      'Onboarding + login & registrasi berbasis fragment',
      'Data produk dari Firebase Realtime Database',
      'Pemuatan gambar dengan Glide',
    ],
    tags: ['Kotlin', 'Android', 'Firebase', 'Glide'],
    repo: 'https://github.com/rifkyprayoga/Ecommerce',
    demo: '',
  },
  {
    id: 'moviez',
    title: 'Moviez',
    category: 'Mobile App',
    kind: 'mobile',
    year: '2024',
    role: 'Android Developer',
    gradient: 'linear-gradient(135deg, #1a0510 0%, #831843 55%, #f43f5e 100%)',
    image: '',
    description: 'Aplikasi katalog film Android dengan intro slider, banner carousel, dan data dari Firebase.',
    longDesc:
      'Aplikasi katalog film untuk Android. Pengguna disambut layar intro, lalu masuk ke beranda dengan slider film unggulan dan daftar film yang datanya diambil dari Firebase Realtime Database. Navigasi bawah memakai chip navigation bar.',
    highlights: [
      'Layar intro dan slider banner film',
      'Data film dari Firebase Realtime Database',
      'Chip navigation bar dan pemuatan gambar dengan Glide',
    ],
    tags: ['Kotlin', 'Android', 'Firebase', 'Glide'],
    repo: '',
    demo: '',
  },
  {
    id: 'portofolio',
    title: 'Portofolio Pribadi',
    category: 'Web App',
    kind: 'web',
    year: '2026',
    role: 'Designer & Developer',
    gradient: 'linear-gradient(135deg, #050510 0%, #1e1b4b 55%, #00b4d8 100%)',
    image: '',
    description: 'Situs ini sendiri: kartu lanyard 3D, animasi GSAP, musik latar, dan buku tamu dengan Supabase.',
    longDesc:
      'Situs portofolio yang sedang kamu lihat. Dibangun dengan Vite + React, animasi GSAP, kartu lanyard 3D interaktif dengan Three.js, musik latar, serta form kontak dan buku tamu yang tersimpan di Supabase dengan moderasi komentar.',
    highlights: [
      'Kartu lanyard 3D interaktif (Three.js)',
      'Animasi scroll & intro dengan GSAP',
      'Form kontak dan buku tamu dengan moderasi (Supabase + RLS)',
      'Responsif untuk HP dan deploy otomatis di Vercel',
    ],
    tags: ['React', 'Vite', 'GSAP', 'Three.js', 'Supabase', 'Vercel'],
    repo: 'https://github.com/rifkyprayoga/Portofolio',
    demo: 'https://portofolio-goy3.vercel.app',
  },
]

export const techStack = [
  {
    category: 'Mobile Development',
    skills: [
      { name: 'Flutter', logo: icon('flutter/flutter-original') },
      { name: 'Dart', logo: icon('dart/dart-original') },
      { name: 'Kotlin', logo: icon('kotlin/kotlin-original') },
      { name: 'Jetpack Compose', logo: icon('jetpackcompose/jetpackcompose-original') },
      { name: 'React Native', logo: icon('react/react-original') },
      { name: 'Android Studio', logo: icon('androidstudio/androidstudio-original') },
    ],
  },
  {
    category: 'Frontend Development',
    skills: [
      { name: 'React', logo: icon('react/react-original') },
      { name: 'Next.js', logo: icon('nextjs/nextjs-original') },
      { name: 'TypeScript', logo: icon('typescript/typescript-original') },
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
      { name: 'Laravel', logo: icon('laravel/laravel-original') },
      { name: 'MySQL', logo: icon('mysql/mysql-original') },
      { name: 'PostgreSQL', logo: icon('postgresql/postgresql-original') },
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
      { name: 'Playwright', logo: icon('playwright/playwright-original') },
      { name: 'Linux', logo: icon('linux/linux-original') },
    ],
  },
]

// Taruh gambar sertifikat di /public/images/certificates/ — TODO
// contoh: { title: 'Belajar Flutter Dasar', issuer: 'Dicoding', year: '2025', image: '/images/certificates/flutter.jpg' }
export const certificates = []

// contoh: { title: 'Juara 2 Lomba Aplikasi Mobile', issuer: 'Nama Penyelenggara', year: '2025', image: '' }
export const awards = []
