-- Esquema base para la landing de la IPA Marcos Paz.

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha timestamptz not null,
  lugar text,
  publicado boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mensajes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  mensaje text not null,
  created_at timestamptz not null default now()
);

alter table public.eventos enable row level security;
alter table public.mensajes enable row level security;

-- Los eventos publicados son visibles públicamente.
create policy "eventos_lectura_publica"
  on public.eventos for select
  to anon, authenticated
  using (publicado = true);

-- Cualquiera puede enviar un mensaje de contacto, pero nadie puede leerlos
-- con la clave anónima (solo desde el panel de Supabase o con service_role).
create policy "mensajes_insercion_publica"
  on public.mensajes for insert
  to anon, authenticated
  with check (
    char_length(nombre) between 1 and 120
    and char_length(email) between 3 and 160
    and char_length(mensaje) between 1 and 2000
  );
