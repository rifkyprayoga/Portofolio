-- =========================================================
-- Moderasi buku tamu: komentar baru TIDAK langsung tampil.
-- Setujui di Supabase → Table Editor → comments → centang kolom "approved".
-- Hapus centang untuk menyembunyikan lagi komentar yang sudah tampil.
-- Jalankan sekali di Supabase → SQL Editor (setelah 0001_init.sql).
-- =========================================================

-- Tambah kolom "approved". Komentar yang SUDAH ADA saat migrasi ini dijalankan
-- tetap tampil (true); komentar BARU setelahnya default tersembunyi (false).
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'comments' and column_name = 'approved'
  ) then
    alter table comments add column approved boolean not null default true;
    alter table comments alter column approved set default false;
  end if;
end $$;

create index if not exists comments_approved_created_idx on comments (approved, created_at desc);

-- Publik hanya bisa membaca komentar yang sudah disetujui
drop policy if exists comments_public_read on comments;
create policy comments_public_read on comments for select to anon, authenticated using (approved);

-- Publik tetap bisa menulis, tapi tidak bisa menyetujui komentarnya sendiri
drop policy if exists comments_public_insert on comments;
create policy comments_public_insert on comments for insert to anon, authenticated
  with check (
    approved = false
    and length(trim(name)) between 1 and 60
    and length(trim(message)) between 1 and 500
    and (
      avatar_url is null
      or (length(avatar_url) <= 500 and avatar_url like '%/storage/v1/object/public/comment-avatars/%')
    )
  );
