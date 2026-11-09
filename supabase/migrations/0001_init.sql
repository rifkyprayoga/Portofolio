-- =========================================================
-- Portofolio — tabel pesan kontak & buku tamu
-- Jalankan sekali di Supabase → SQL Editor
-- =========================================================

-- Pesan dari form kontak: pengunjung hanya bisa MENGIRIM, tidak bisa membaca.
-- Baca pesan masuk lewat Supabase → Table Editor → contact_messages.
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table contact_messages enable row level security;

drop policy if exists contact_public_insert on contact_messages;
create policy contact_public_insert on contact_messages for insert to anon, authenticated
  with check (
    length(name) between 1 and 100
    and length(email) between 3 and 200
    and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(message) between 1 and 3000
  );

-- Buku tamu: publik bisa membaca & menulis, tidak bisa mengubah/menghapus.
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table comments enable row level security;
create index if not exists comments_created_at_idx on comments (created_at desc);

drop policy if exists comments_public_read on comments;
create policy comments_public_read on comments for select to anon, authenticated using (true);

drop policy if exists comments_public_insert on comments;
create policy comments_public_insert on comments for insert to anon, authenticated
  with check (
    length(trim(name)) between 1 and 60
    and length(trim(message)) between 1 and 500
    and (
      avatar_url is null
      or (length(avatar_url) <= 500 and avatar_url like '%/storage/v1/object/public/comment-avatars/%')
    )
  );

-- Storage untuk foto profil komentar: publik, maks 5 MB, hanya gambar
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('comment-avatars', 'comment-avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists avatars_public_upload on storage.objects;
create policy avatars_public_upload on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'comment-avatars');
