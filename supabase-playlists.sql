create extension if not exists "pgcrypto";

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  youtube_playlist_id text not null,
  title text not null,
  thumbnail text not null default '',
  channel_title text not null default '',
  video_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, youtube_playlist_id)
);

create table if not exists public.playlist_videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  youtube_id text not null,
  title text not null,
  thumbnail text not null default '',
  channel_title text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (playlist_id, youtube_id)
);

create index if not exists playlists_user_id_idx on public.playlists(user_id);
create index if not exists playlist_videos_user_id_idx on public.playlist_videos(user_id);
create index if not exists playlist_videos_playlist_id_position_idx on public.playlist_videos(playlist_id, position);

alter table public.playlists enable row level security;
alter table public.playlist_videos enable row level security;

drop policy if exists "Users can read their playlists" on public.playlists;
drop policy if exists "Users can insert their playlists" on public.playlists;
drop policy if exists "Users can update their playlists" on public.playlists;
drop policy if exists "Users can delete their playlists" on public.playlists;

create policy "Users can read their playlists"
on public.playlists for select
using (auth.uid() = user_id);

create policy "Users can insert their playlists"
on public.playlists for insert
with check (auth.uid() = user_id);

create policy "Users can update their playlists"
on public.playlists for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their playlists"
on public.playlists for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their playlist videos" on public.playlist_videos;
drop policy if exists "Users can insert their playlist videos" on public.playlist_videos;
drop policy if exists "Users can update their playlist videos" on public.playlist_videos;
drop policy if exists "Users can delete their playlist videos" on public.playlist_videos;

create policy "Users can read their playlist videos"
on public.playlist_videos for select
using (auth.uid() = user_id);

create policy "Users can insert their playlist videos"
on public.playlist_videos for insert
with check (auth.uid() = user_id);

create policy "Users can update their playlist videos"
on public.playlist_videos for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their playlist videos"
on public.playlist_videos for delete
using (auth.uid() = user_id);
