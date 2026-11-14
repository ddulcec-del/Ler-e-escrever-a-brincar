-- Texto livre do aluno associado a um resultado (ex.: o reconto de uma
-- história interativa entregue à professora).
alter table public.activity_results
  add column if not exists notes text;
