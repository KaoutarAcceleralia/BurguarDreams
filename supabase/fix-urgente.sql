-- ARREGLO URGENTE (30 segundos) — quita el error 400 "schema net does not exist"
-- SQL Editor → New query → pegar → Run
-- https://supabase.com/dashboard/project/yscbwngotgbkytmzogol/sql/new

do $$
declare r record;
begin
  for r in
    select t.tgname from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'solicitudes' and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on public.solicitudes', r.tgname);
  end loop;
end $$;

drop policy if exists "anon_insert_solicitudes" on public.solicitudes;
alter table public.solicitudes enable row level security;
create policy "anon_insert_solicitudes"
  on public.solicitudes for insert to anon, authenticated with check (true);
