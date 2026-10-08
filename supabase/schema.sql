create extension if not exists pgcrypto;

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  role text not null default 'admin' check (role in ('admin','superadmin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  roll_number text not null unique,
  name text not null,
  department text not null default '',
  position text not null default '',
  language text not null default '',
  github text not null default '#',
  linkedin text not null default '#',
  portfolio text not null default '#',
  photo text not null default '',
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  poster text not null default '',
  description text not null,
  venue text not null,
  deadline timestamptz not null,
  status text not null default 'OPEN' check (status in ('OPEN','ONGOING','CLOSED')),
  ongoing_since timestamptz,
  register_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  text text not null,
  priority text not null default 'NORMAL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leaderboard (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text not null default '',
  division text not null default '',
  threat_class text not null default '',
  xp integer not null default 0 check (xp >= 0),
  missions integer not null default 0 check (missions >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null,
  img text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  img text not null,
  download_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  url text not null,
  kind text not null default 'image' check (kind in ('image','poster')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact (
  id uuid primary key default gen_random_uuid(),
  faculty_coordinator text not null default '',
  hod text not null default '',
  email text not null default '',
  facebook text not null default '',
  linkedin text not null default '',
  instagram text not null default '',
  discord text not null default '',
  map_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  active_agents integer not null default 0 check (active_agents >= 0),
  community_members integer not null default 0 check (community_members >= 0),
  projects_completed integer not null default 0 check (projects_completed >= 0),
  workshops_conducted integer not null default 0 check (workshops_conducted >= 0),
  hackathons_organised integer not null default 0 check (hackathons_organised >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  home jsonb not null default '{}'::jsonb,
  sections jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agents_display_order_idx on agents(display_order);
create index if not exists events_deadline_idx on events(deadline);
create index if not exists events_status_idx on events(status);
create index if not exists leaderboard_xp_idx on leaderboard(xp desc);

alter table admins enable row level security;
alter table agents enable row level security;
alter table events enable row level security;
alter table alerts enable row level security;
alter table leaderboard enable row level security;
alter table gallery enable row level security;
alter table posters enable row level security;
alter table media enable row level security;
alter table contact enable row level security;
alter table stats enable row level security;
alter table site_settings enable row level security;


-- Supabase Storage bucket for all CodeOPS uploaded media.
insert into storage.buckets (id, name, public)
values ('codeops-media', 'codeops-media', true)
on conflict (id) do update set public = true;
