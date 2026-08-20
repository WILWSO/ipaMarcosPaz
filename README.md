# Iglesia Presbiteriana Argentina — Marcos Paz

Landing page de la congregación. Stack: **React + Vite + TypeScript + Tailwind CSS v4 + Supabase**.

## Puesta en marcha

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Para probar la autenticacion SSO local, usa Vercel Dev, porque `npm run dev`
solo ejecuta Vite y no procesa las funciones de `api/`:

```powershell
npm run dev:vercel
```

Deja IglesiasNet ejecutandose en `http://localhost:5173` y verifica que
`.env.local` tenga `IGLESIANET_URL=http://localhost:5173` y
`IPA_REDIRECT_URI=http://localhost:3000/area-privada/callback`.

## Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ejecutar el contenido de `supabase/schema.sql` en el SQL Editor.
3. Copiar la URL y la `anon key` del proyecto en el archivo `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sin estas variables la página funciona igual, mostrando eventos de ejemplo y
deshabilitando el envío del formulario de contacto.

Tablas usadas:

- `eventos`: lectura pública de los registros con `publicado = true`.
- `mensajes`: solo permite `insert` desde el formulario; la lectura queda restringida.

## Estructura

```
src/
  components/   Secciones de la landing (Hero, Horarios, Eventos, Contacto...)
  data/         Textos e información de la iglesia (editar aquí el contenido)
  lib/          Cliente de Supabase
supabase/       Esquema SQL y políticas RLS
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run preview` — previsualizar el build
