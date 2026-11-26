// =========================================================
// SEMUA KONTEN SITUS ADA DI FILE INI.
// Teks dua bahasa ditulis sebagai { id: '...', en: '...' }; string biasa = sama untuk dua bahasa.
// Bagian bertanda TODO masih placeholder — ganti dengan data aslimu.
// =========================================================

const icon = (path) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${path}.svg`

export const profile = {
  name: 'Rifky Deby Prayoga',
  shortName: 'Rifky',
  initials: 'RD',
  role: 'Mobile Developer',
  githubUser: 'rifkyprayoga',
  // Teks yang berganti-ganti di hero
  roles: ['Mobile Developer', 'Flutter Developer', 'Android Enthusiast', 'Fullstack Learner'],
  tagline: {
    id: 'Membangun aplikasi mobile yang cepat, rapi, dan enak dipakai setiap hari.',
    en: 'Building mobile apps that are fast, clean, and a joy to use every day.',
  },
  heroDescription: {
    id: 'Dengan Flutter, Kotlin, dan teknologi web modern, saya mengubah ide menjadi aplikasi yang intuitif, responsif, dan benar-benar dipakai orang.',
    en: 'With Flutter, Kotlin, and modern web tech, I turn ideas into apps that are intuitive, responsive, and actually used by people.',
  },
  // Taruh fotomu di /public/images/profile.jpg lalu isi: '/images/profile.jpg'
  photo: '', // TODO
  // Desain sisi depan kartu lanyard (rasio ±1024×1526, lubang tali tergambar di tengah atas)
  lanyardFront: '/images/lanyard-front.webp',
  // Potret About (latar transparan, ukuran & posisi wajah sama) — foto kedua muncul saat kursor lewat
  aboutPhoto: '/images/about-me.webp',
  aboutPhotoAlt: '/images/about-batman.webp',
  location: 'Indonesia', // TODO
  email: '', // TODO: isi untuk menampilkan kartu email di kontak
  bio: {
    // TODO: tulis ulang dengan kalimatmu sendiri
    id: [
      'Halo! Saya Rifky, seorang mobile developer yang suka mengubah ide menjadi aplikasi yang nyaman digunakan. Fokus saya ada di pengembangan aplikasi Android & lintas platform.',
      'Selain mobile, saya juga membangun web dan backend — mulai dari dashboard admin, toko online, sampai integrasi database — supaya aplikasi yang saya buat lengkap dari depan sampai belakang.',
    ],
    en: [
      "Hi! I'm Rifky, a mobile developer who loves turning ideas into apps that feel good to use. My focus is Android and cross-platform development.",
      'Beyond mobile, I also build web apps and backends — from admin dashboards and online stores to database integrations — so the apps I make are complete from front to back.',
    ],
  },
  cvUrl: '', // link CV (Google Drive / PDF di /public) — kosong = tombol disembunyikan
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

// Timeline pengalaman & pendidikan (diurutkan otomatis dari yang terbaru)
// type: 'work' | 'edu' · org = tempat · role = peran / jurusan · end: null = sampai sekarang
export const experience = [
  {
    type: 'work',
    org: 'IconPlus',
    role: { id: 'Tukang Lap Kaca Gedung | Office Boy', en: 'Building Window Cleaner | Office Boy' },
    start: '2022',
    end: null,
    logo: '',
  },
  {
    type: 'work',
    org: 'Gerutas',
    role: 'Full-Stack Developer | Web Designer | Content Creator',
    start: '2022',
    end: '2022',
    logo: '',
  },
  { type: 'work', org: 'Paket Nasi', role: 'UI/UX Designer', start: '2021', end: '2021', logo: '' },
  {
    type: 'edu',
    org: 'Universitas Amikom',
    role: { id: 'Teknik Pengendalian Anu', en: 'Engineering of Controlling Stuff' },
    start: '2021',
    end: '2021',
    logo: '',
  },
  { type: 'work', org: 'Iwan Tirta', role: 'Office Boy', start: '2020', end: '2020', logo: '' },
]

const OTOMASI = { id: 'Otomasi & Bot', en: 'Automation & Bots' }

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
    description: {
      id: 'Sistem presensi sekolah: aplikasi Android untuk siswa & guru dengan QR dinamis, selfie + deteksi wajah, dan GPS, plus dashboard web.',
      en: 'A school attendance system: an Android app for students & teachers with dynamic QR codes, selfie + face detection, and GPS, plus a web dashboard.',
    },
    longDesc: {
      id: 'Penulisan ulang aplikasi presensi lama (Yii2) menjadi dua bagian: backend Laravel 13 + Filament 5 sebagai dashboard admin/guru sekaligus REST API, dan aplikasi Android native Kotlin + Jetpack Compose. Guru membuka sesi lalu menampilkan QR yang berganti tiap 30 detik, sehingga foto QR yang dibagikan ke teman tidak bisa dipakai. Server memeriksa token, kelas, radius GPS, lokasi palsu, dan presensi ganda, lalu menentukan status Hadir/Terlambat/Alpa secara otomatis.',
      en: 'A rewrite of a legacy attendance app (Yii2) into two parts: a Laravel 13 + Filament 5 backend that serves as the admin/teacher dashboard and REST API, and a native Android app built with Kotlin + Jetpack Compose. Teachers open a session that shows a QR code rotating every 30 seconds, so a photo of the QR shared with friends is useless. The server validates the token, class, GPS radius, mock locations, and duplicate check-ins, then marks students Present/Late/Absent automatically.',
    },
    highlights: {
      id: [
        'QR dinamis berganti tiap 30 detik + validasi geofence & deteksi lokasi palsu',
        'Selfie gerbang dengan ML Kit Face Detection (1 wajah + deteksi kedipan)',
        'Riwayat kalender, rekap PDF, pengajuan izin dengan lampiran, kartu pelajar digital ber-QR',
        'Sesi presensi dibuat otomatis tiap malam; siswa yang tidak hadir ditandai Alpa saat sesi ditutup',
        'Notifikasi latar belakang dengan WorkManager',
      ],
      en: [
        'QR codes rotating every 30 seconds + geofence validation & mock-location detection',
        'Gate selfie with ML Kit Face Detection (exactly one face + blink detection)',
        'Calendar history, PDF reports, leave requests with attachments, digital student ID with QR',
        'Sessions generated nightly; students who never checked in are marked Absent when a session closes',
        'Background notifications with WorkManager',
      ],
    },
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
    image: '/images/projects/daya-pustaka.webp',
    description: {
      id: 'Situs penerbit & toko buku lengkap dengan katalog, checkout, lacak pesanan, dan dashboard admin.',
      en: 'A publisher & bookstore site with a catalog, checkout, order tracking, and an admin dashboard.',
    },
    longDesc: {
      id: 'Daya Pustaka adalah situs penerbit dan toko buku yang dibangun dengan Next.js dan Supabase. Pengunjung bisa menjelajah katalog dengan filter, memesan buku, melacak pesanan, hingga mengirim naskah. Di sisi admin tersedia dashboard untuk mengelola buku, pesanan, naskah masuk, reseller, dan konten beranda — semua perubahan langsung tampil di situs.',
      en: 'Daya Pustaka is a publisher and bookstore website built with Next.js and Supabase. Visitors can browse the catalog with filters, order books, track orders, and submit manuscripts. Admins get a dashboard to manage books, orders, incoming manuscripts, resellers, and homepage content — every change shows up on the site instantly.',
    },
    highlights: {
      id: [
        'Katalog dengan filter kategori / seri / label / pencarian, halaman buku ber-SEO (Open Graph & schema.org)',
        'Keranjang → checkout; harga & stok dihitung di database, bukan di browser',
        'Lacak pesanan dan kirim naskah lewat tautan Google Drive',
        'Dashboard admin: alur status pesanan, stok otomatis, resi, pesan WhatsApp siap kirim',
        'Kurasi naskah, persetujuan reseller, dan pengaturan konten beranda',
      ],
      en: [
        'Catalog with category / series / label / search filters, SEO-ready book pages (Open Graph & schema.org)',
        'Cart → checkout; prices & stock are computed in the database, not the browser',
        'Order tracking and manuscript submission via Google Drive links',
        'Admin dashboard: order status flow, automatic stock, tracking numbers, ready-to-send WhatsApp messages',
        'Manuscript curation, reseller approval, and homepage content settings',
      ],
    },
    tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    repo: '',
    demo: '',
  },
  {
    id: 'meeting-assistant',
    title: { id: 'Asisten Meeting AI', en: 'AI Meeting Assistant' },
    category: 'AI & Desktop',
    kind: 'desktop',
    year: '2026',
    role: 'Developer',
    gradient: 'linear-gradient(135deg, #0d0a24 0%, #4c1d95 55%, #2c67ed 100%)',
    image: '',
    description: {
      id: 'Asisten untuk meeting online: transkrip, terjemahan otomatis, dan saran jawaban real-time dengan Gemini.',
      en: 'An assistant for online meetings: live transcripts, automatic translation, and real-time reply suggestions with Gemini.',
    },
    longDesc: {
      id: 'Program Windows yang mendengarkan meeting online (Zoom, Google Meet, dll.) tanpa perlu memasukkan bot ke ruang meeting. Suara lawan bicara diambil dari audio speaker (WASAPI loopback) dan suara sendiri dari mikrofon, dipotong per ucapan, lalu dikirim ke Gemini untuk ditranskrip, diterjemahkan, dan dibuatkan saran jawaban sesuai konteks yang ditulis pengguna.',
      en: 'A Windows program that listens to online meetings (Zoom, Google Meet, etc.) without adding a bot to the call. The other side is captured from speaker audio (WASAPI loopback) and your own voice from the microphone, split per utterance, then sent to Gemini to transcribe, translate, and suggest replies based on context the user writes.',
    },
    highlights: {
      id: [
        'Tangkap audio dua arah: loopback speaker + mikrofon',
        'Pemotongan audio per ucapan berdasarkan jeda hening',
        'Transkrip, terjemahan (deteksi bahasa otomatis), dan saran jawaban',
        'File konteks pribadi agar jawaban sesuai situasi, tanpa mengarang fakta',
        'Overlay desktop (PySide6) dan dibundel jadi .exe dengan PyInstaller',
      ],
      en: [
        'Two-way audio capture: speaker loopback + microphone',
        'Utterance splitting based on silence gaps',
        'Transcripts, translation (auto language detection), and reply suggestions',
        'Personal context file so suggestions fit the situation without making things up',
        'Desktop overlay (PySide6), bundled as an .exe with PyInstaller',
      ],
    },
    tags: ['Python', 'Gemini API', 'PySide6', 'WASAPI', 'PyInstaller'],
    repo: '',
    demo: '',
    preview: {
      id: ['Lawan bicara', 'Can you walk me through it?', 'Terjemahan', 'Bisa jelaskan alurnya?', 'Saran jawaban'],
      en: ['Speaker', 'Bisa jelaskan alurnya?', 'Translation', 'Can you walk me through it?', 'Suggested reply'],
    },
  },
  {
    id: 'forex-bot',
    title: 'Forex Trend Bot',
    category: OTOMASI,
    kind: 'terminal',
    year: '2026',
    role: 'Developer',
    gradient: 'linear-gradient(135deg, #021208 0%, #064e3b 55%, #10b981 100%)',
    image: '',
    description: {
      id: 'Bot trading MetaTrader 5 dengan backtest, riset strategi in-sample vs out-of-sample, dan rem risiko berlapis.',
      en: 'A MetaTrader 5 trading bot with backtesting, in-sample vs out-of-sample strategy research, and layered risk brakes.',
    },
    longDesc: {
      id: 'Bot trend-following untuk MetaTrader 5. Logika sinyal yang sama dipakai untuk backtest dan live, sehingga hasil uji tidak berbeda dengan yang dijalankan. Tujuh keluarga strategi dibandingkan secara in-sample dan out-of-sample sebelum dipilih. Bot berjalan dalam mode dry-run secara default dan dilengkapi rem risiko otomatis.',
      en: 'A trend-following bot for MetaTrader 5. The same signal logic powers both backtests and live trading, so test results match what actually runs. Seven strategy families were compared in-sample and out-of-sample before choosing one. The bot runs in dry-run mode by default and has automatic risk brakes.',
    },
    highlights: {
      id: [
        'Satu modul strategi untuk backtest & live (identik)',
        'Riset 7 keluarga strategi dengan validasi out-of-sample',
        'Risiko 2% per posisi, stop entry saat rugi harian ≥ 6% atau drawdown ≥ 35%',
        'Mode DRY_RUN default, auto-restart saat crash, notifikasi',
      ],
      en: [
        'One strategy module for backtest & live (identical)',
        'Research across 7 strategy families with out-of-sample validation',
        '2% risk per position; entries stop at ≥ 6% daily loss or ≥ 35% drawdown',
        'DRY_RUN by default, auto-restart on crash, notifications',
      ],
    },
    tags: ['Python', 'MetaTrader 5', 'pandas', 'NumPy', 'Backtesting'],
    repo: '',
    demo: '',
    preview: {
      id: [
        '$ python backtest.py --tf H4',
        'Strategi : trend-following',
        'Risiko   : 2% / posisi',
        'Mode     : DRY_RUN',
        '[OK] Sinyal identik backtest & live',
      ],
      en: [
        '$ python backtest.py --tf H4',
        'Strategy : trend-following',
        'Risk     : 2% / position',
        'Mode     : DRY_RUN',
        '[OK] Identical signals in backtest & live',
      ],
    },
  },
  {
    id: 'crypto-bot',
    title: 'Crypto Paper Trading Bot',
    category: OTOMASI,
    kind: 'terminal',
    year: '2026',
    role: 'Developer',
    gradient: 'linear-gradient(135deg, #140a02 0%, #7c2d12 55%, #f59e0b 100%)',
    image: '',
    description: {
      id: 'Bot paper trading BTC/ETH/SOL dari data Indodax dengan strategi Donchian breakout, notifikasi Telegram, dan dashboard.',
      en: 'A BTC/ETH/SOL paper trading bot on Indodax data with a Donchian breakout strategy, Telegram alerts, and a dashboard.',
    },
    longDesc: {
      id: 'Bot untuk menguji strategi crypto tanpa uang sungguhan. Data diambil dari Indodax (data publik), lalu strategi Donchian breakout dijalankan pada BTC/IDR, ETH/IDR, dan SOL/IDR dengan modal dibagi rata. Dilengkapi backtest, optimasi parameter, notifikasi Telegram, dan dashboard web sederhana untuk memantau equity.',
      en: 'A bot for testing crypto strategies without real money. It pulls public data from Indodax and runs a Donchian breakout strategy on BTC/IDR, ETH/IDR, and SOL/IDR with capital split evenly. It includes backtesting, parameter optimization, Telegram notifications, and a simple web dashboard to monitor equity.',
    },
    highlights: {
      id: [
        'Backtest + optimasi parameter dengan data historis 2 tahun',
        'Paper trading timeframe 4 jam, tiga koin sekaligus',
        'Notifikasi Telegram: BUY/SELL, ringkasan harian, peringatan error',
        'Dashboard monitoring equity berbasis web',
        'Autostart di Windows lewat skrip PowerShell',
      ],
      en: [
        'Backtesting + parameter optimization on 2 years of historical data',
        'Paper trading on the 4-hour timeframe, three coins at once',
        'Telegram alerts: BUY/SELL, daily summary, error warnings',
        'Web-based equity monitoring dashboard',
        'Windows autostart via PowerShell scripts',
      ],
    },
    tags: ['Python', 'ccxt', 'pandas', 'Telegram Bot', 'Backtesting'],
    repo: '',
    demo: '',
    preview: {
      id: [
        '$ python paper_trade.py',
        'Pair : BTC/IDR ETH/IDR SOL/IDR',
        'TF   : 4h · Donchian 120/40',
        '[BUY] ETH/IDR breakout',
        '[TG] Notifikasi terkirim',
      ],
      en: [
        '$ python paper_trade.py',
        'Pair : BTC/IDR ETH/IDR SOL/IDR',
        'TF   : 4h · Donchian 120/40',
        '[BUY] ETH/IDR breakout',
        '[TG] Notification sent',
      ],
    },
  },
  {
    id: 'rekap-multi-db',
    title: { id: 'Rekap Data Multi-Database', en: 'Multi-Database Report Builder' },
    category: OTOMASI,
    kind: 'terminal',
    year: '2026',
    role: 'Developer',
    badge: { id: 'Proyek Kantor', en: 'Work Project' },
    gradient: 'linear-gradient(135deg, #04101f 0%, #1e3a8a 55%, #0ea5e9 100%)',
    image: '',
    description: {
      id: 'Skrip yang menarik data dari banyak database PostgreSQL secara paralel lalu menggabungkannya jadi satu laporan Excel.',
      en: 'A script that pulls data from many PostgreSQL databases in parallel and merges it into a single Excel report.',
    },
    longDesc: {
      id: 'Alat bantu rekap data layanan yang tersebar di beberapa database regional. Koneksi database dibaca otomatis dari file .env (DB1, DB2, … DBn), query dijalankan paralel ke semua database, lalu hasilnya digabung menjadi satu file Excel siap pakai. Pekerjaan yang sebelumnya dilakukan manual per database kini selesai dalam satu perintah.',
      en: 'A helper for compiling service data spread across several regional databases. Database connections are read automatically from a .env file (DB1, DB2, … DBn), queries run in parallel against every database, and the results are merged into one ready-to-use Excel file. Work that used to be done manually per database now takes a single command.',
    },
    highlights: {
      id: [
        'Deteksi otomatis semua koneksi database dari .env',
        'Query paralel dengan ThreadPoolExecutor',
        'Penggabungan hasil dengan pandas dan ekspor ke Excel',
      ],
      en: [
        'Auto-detects every database connection from .env',
        'Parallel queries with ThreadPoolExecutor',
        'Merges results with pandas and exports to Excel',
      ],
    },
    tags: ['Python', 'PostgreSQL', 'pandas', 'openpyxl'],
    repo: '',
    demo: '',
    note: {
      id: 'Alat internal — kode sumber tidak dipublikasikan.',
      en: 'Internal tool — source code is not public.',
    },
    preview: {
      id: ['$ python rekap.py', '[..] DB1 … DB6 terdeteksi', '[OK] Query paralel selesai', '[OK] rekap.xlsx dibuat'],
      en: ['$ python rekap.py', '[..] DB1 … DB6 detected', '[OK] Parallel queries done', '[OK] rekap.xlsx created'],
    },
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
    description: {
      id: 'Aplikasi Android untuk jaringan marketing & afiliasi Paket Nasi: komisi, jaringan agen, transaksi, dan materi promosi.',
      en: "An Android app for Paket Nasi's marketing & affiliate network: commissions, agent network, transactions, and promo materials.",
    },
    longDesc: {
      id: 'Aplikasi Android untuk tim marketing Paket Nasi. Pengguna bisa memantau jaringan agen dan katering di bawahnya, komisi, pencapaian, riwayat transaksi, serta mengunduh materi promosi. Saya terlibat di sisi desain antarmuka dan alur pengguna.',
      en: "An Android app for Paket Nasi's marketing team. Users can track the agents and caterers in their network, commissions, achievements, and transaction history, and download promo materials. I worked on the interface design and user flows.",
    },
    highlights: {
      id: [
        'Struktur jaringan marketing bertingkat (agen & katering)',
        'Komisi, pencapaian, dan riwayat transaksi',
        'Banner, materi promosi, dan pesan masuk',
        'Notifikasi push dengan Firebase Cloud Messaging',
      ],
      en: [
        'Multi-level marketing network (agents & caterers)',
        'Commissions, achievements, and transaction history',
        'Banners, promo materials, and inbox',
        'Push notifications with Firebase Cloud Messaging',
      ],
    },
    tags: ['Kotlin', 'Android', 'Retrofit', 'Firebase', 'UI/UX'],
    repo: '',
    demo: '',
  },
  {
    id: 'ecommerce-app',
    title: { id: 'Aplikasi E-Commerce', en: 'E-Commerce App' },
    category: 'Mobile App',
    kind: 'mobile',
    year: '2024',
    role: 'Android Developer',
    gradient: 'linear-gradient(135deg, #0a0f2c 0%, #3730a3 55%, #60a5fa 100%)',
    image: '',
    description: {
      id: 'Aplikasi belanja Android dengan onboarding, login/registrasi, dan katalog produk dari Firebase.',
      en: 'An Android shopping app with onboarding, login/registration, and a product catalog from Firebase.',
    },
    longDesc: {
      id: 'Aplikasi e-commerce Android yang dibangun dengan Kotlin. Alurnya dimulai dari halaman pengenalan, pilihan akun, login dan registrasi, lalu masuk ke halaman belanja. Data produk diambil dari Firebase Realtime Database dan gambar dimuat dengan Glide.',
      en: 'An Android e-commerce app built with Kotlin. The flow starts with an introduction screen, account options, login and registration, then the shopping screen. Product data comes from Firebase Realtime Database and images are loaded with Glide.',
    },
    highlights: {
      id: [
        'Onboarding + login & registrasi berbasis fragment',
        'Data produk dari Firebase Realtime Database',
        'Pemuatan gambar dengan Glide',
      ],
      en: ['Fragment-based onboarding + login & registration', 'Product data from Firebase Realtime Database', 'Image loading with Glide'],
    },
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
    description: {
      id: 'Aplikasi katalog film Android dengan intro slider, banner carousel, dan data dari Firebase.',
      en: 'An Android movie catalog app with an intro slider, banner carousel, and data from Firebase.',
    },
    longDesc: {
      id: 'Aplikasi katalog film untuk Android. Pengguna disambut layar intro, lalu masuk ke beranda dengan slider film unggulan dan daftar film yang datanya diambil dari Firebase Realtime Database. Navigasi bawah memakai chip navigation bar.',
      en: 'A movie catalog app for Android. Users are greeted by an intro screen, then land on a home screen with a featured-movie slider and a movie list loaded from Firebase Realtime Database. Bottom navigation uses a chip navigation bar.',
    },
    highlights: {
      id: [
        'Layar intro dan slider banner film',
        'Data film dari Firebase Realtime Database',
        'Chip navigation bar dan pemuatan gambar dengan Glide',
      ],
      en: ['Intro screen and movie banner slider', 'Movie data from Firebase Realtime Database', 'Chip navigation bar and image loading with Glide'],
    },
    tags: ['Kotlin', 'Android', 'Firebase', 'Glide'],
    repo: '',
    demo: '',
  },
  {
    id: 'portofolio',
    title: { id: 'Portofolio Pribadi', en: 'Personal Portfolio' },
    category: 'Web App',
    kind: 'web',
    year: '2026',
    role: 'Designer & Developer',
    gradient: 'linear-gradient(135deg, #050510 0%, #1e1b4b 55%, #00b4d8 100%)',
    image: '/images/projects/portofolio.webp',
    description: {
      id: 'Situs ini sendiri: kartu lanyard 3D, animasi GSAP, dua bahasa, tema terang/gelap, dan buku tamu dengan Supabase.',
      en: 'This very site: a 3D lanyard card, GSAP animations, two languages, light/dark themes, and a Supabase guestbook.',
    },
    longDesc: {
      id: 'Situs portofolio yang sedang kamu lihat. Dibangun dengan Vite + React, animasi GSAP, kartu lanyard 3D interaktif dengan Three.js, musik latar, dua bahasa (Indonesia/Inggris), tema terang/gelap, statistik GitHub langsung, serta form kontak dan buku tamu yang tersimpan di Supabase dengan moderasi komentar.',
      en: "The portfolio site you're looking at. Built with Vite + React, GSAP animations, an interactive 3D lanyard card in Three.js, background music, two languages (Indonesian/English), light/dark themes, live GitHub stats, and a contact form and guestbook stored in Supabase with comment moderation.",
    },
    highlights: {
      id: [
        'Kartu lanyard 3D interaktif (Three.js)',
        'Animasi scroll & intro dengan GSAP',
        'Dua bahasa dan tema terang/gelap yang diingat browser',
        'Form kontak dan buku tamu dengan moderasi (Supabase + RLS)',
        'Library berat dimuat saat dibutuhkan, deploy otomatis di Vercel',
      ],
      en: [
        'Interactive 3D lanyard card (Three.js)',
        'Scroll & intro animations with GSAP',
        'Two languages and light/dark themes remembered by the browser',
        'Contact form and moderated guestbook (Supabase + RLS)',
        'Heavy libraries load on demand, auto-deployed on Vercel',
      ],
    },
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
