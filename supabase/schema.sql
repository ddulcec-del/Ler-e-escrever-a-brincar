-- Ler e Escrever a Brincar — esquema da base de dados (Supabase / Postgres)
--
-- Colar este ficheiro inteiro no SQL Editor do Supabase e carregar em "Run".
-- Pode ser corrido mais do que uma vez: não apaga dados existentes.
--
-- Quem pode fazer o quê (Row Level Security):
--   * anon (página pública, sem login): lê alunos, planos e exercícios
--     visíveis; regista resultados e palavras do glossário.
--   * authenticated (a professora, com login): pode fazer tudo.

-- ---------------------------------------------------------------- tabelas

create table if not exists public.students (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  age           int  not null default 8,
  school_year   text not null default '2.º ano',
  profile       text not null default 'perfil3',
  start_date    date not null default current_date,
  observations  text not null default '',
  created_at    timestamptz not null default now()
);

create table if not exists public.plans (
  student_id             uuid primary key references public.students(id) on delete cascade,
  priority_competencies  text[] not null default '{}',
  difficulty_level       int  not null default 1 check (difficulty_level between 1 and 3),
  activity_ids           text[] not null default '{}',
  objectives             text[] not null default '{}',
  frequency              text not null default '',
  strategies             text not null default '',
  notes                  text not null default '',
  updated_at             timestamptz not null default now()
);

create table if not exists public.assessments (
  student_id  uuid primary key references public.students(id) on delete cascade,
  date        date not null default current_date,
  ratings     jsonb not null default '{}'::jsonb,
  notes       text not null default '',
  updated_at  timestamptz not null default now()
);

create table if not exists public.sessions (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.students(id) on delete cascade,
  date              date not null default current_date,
  activity_ids      text[] not null default '{}',
  other_activities  text not null default '',
  competencies      text[] not null default '{}',
  summary           text not null default '',
  support_level     text not null default 'Apoio moderado',
  autonomy_degree   text not null default 'Progressiva',
  teacher_notes     text not null default '',
  next_priorities   text not null default '',
  created_at        timestamptz not null default now()
);
create index if not exists sessions_student_idx on public.sessions (student_id, date desc);

create table if not exists public.reports (
  student_id  uuid primary key references public.students(id) on delete cascade,
  strategies  text not null default '',
  continuity  text not null default '',
  updated_at  timestamptz not null default now()
);

create table if not exists public.activities (
  id                     text primary key,
  number                 int,
  title                  text not null,
  game_title             text,
  month                  text not null,
  competency             text not null,
  curriculum_area        text,
  type                   text not null,
  pedagogical_objective  text not null default '',
  simple_instruction     text not null default '',
  demonstration_example  text not null default '',
  levels                 jsonb not null default '{"1":[],"2":[],"3":[]}'::jsonb,
  published              boolean not null default true,
  sort_order             int not null default 0,
  updated_at             timestamptz not null default now()
);

-- Sem chave estrangeira para activities: o histórico guarda o título e
-- continua legível mesmo que o exercício seja apagado.
create table if not exists public.activity_results (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.students(id) on delete cascade,
  activity_id       text not null,
  activity_title    text not null,
  month             text not null,
  competency        text not null,
  difficulty_level  int  not null,
  attempts          int  not null default 0,
  correct_count     int  not null default 0,
  total_count       int  not null default 0,
  hints_used        int  not null default 0,
  autonomy_degree   text not null,
  created_at        timestamptz not null default now()
);
create index if not exists results_student_idx on public.activity_results (student_id, created_at desc);

create table if not exists public.glossary_entries (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  word        text not null,
  meaning     text not null,
  example     text not null default '',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- acessos

grant usage on schema public to anon, authenticated;
grant select on public.students, public.plans, public.activities to anon;
grant select, insert on public.activity_results, public.glossary_entries to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

alter table public.students          enable row level security;
alter table public.plans             enable row level security;
alter table public.assessments       enable row level security;
alter table public.sessions          enable row level security;
alter table public.reports           enable row level security;
alter table public.activities        enable row level security;
alter table public.activity_results  enable row level security;
alter table public.glossary_entries  enable row level security;

-- A professora (qualquer utilizador com login) pode fazer tudo.
do $$
declare t text;
begin
  foreach t in array array['students','plans','assessments','sessions','reports',
                           'activities','activity_results','glossary_entries']
  loop
    execute format('drop policy if exists "professora: tudo" on public.%I', t);
    execute format(
      'create policy "professora: tudo" on public.%I for all to authenticated using (true) with check (true)',
      t);
  end loop;
end $$;

-- Página pública.
drop policy if exists "publico: ler alunos" on public.students;
create policy "publico: ler alunos" on public.students
  for select to anon using (true);

drop policy if exists "publico: ler planos" on public.plans;
create policy "publico: ler planos" on public.plans
  for select to anon using (true);

drop policy if exists "publico: ler exercicios visiveis" on public.activities;
create policy "publico: ler exercicios visiveis" on public.activities
  for select to anon using (published);

drop policy if exists "publico: ler resultados" on public.activity_results;
create policy "publico: ler resultados" on public.activity_results
  for select to anon using (true);
drop policy if exists "publico: registar resultados" on public.activity_results;
create policy "publico: registar resultados" on public.activity_results
  for insert to anon with check (true);

drop policy if exists "publico: ler glossario" on public.glossary_entries;
create policy "publico: ler glossario" on public.glossary_entries
  for select to anon using (true);
drop policy if exists "publico: escrever glossario" on public.glossary_entries;
create policy "publico: escrever glossario" on public.glossary_entries
  for insert to anon with check (true);
