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

## Consulta Presbiteriana (`/consulta-presbiteriana`)

El buscador bilingüe (ES/PT) del Manual Presbiteriano 2025 y el Digesto 2026 es un
proyecto SvelteKit estático e independiente en `consulta-presbiteriana/`. Se publica dentro
de este dominio en `https://www.ipamarcospaz.org/consulta-presbiteriana/`. El sitio la enlaza
desde el ítem «Consulta» del menú superior (`src/components/Navbar.tsx`, URL en
`enlaces.consultaPresbiteriana` de `src/data/contenido.ts`), que la abre en una pestaña nueva.

- `npm run build:consulta` compila esa app con `BASE_PATH=/consulta-presbiteriana` en
  `public/consulta-presbiteriana/` (carpeta generada, ignorada por git) e instala las
  dependencias de `consulta-presbiteriana/` si faltan. No toca `consulta-presbiteriana/build/`,
  la versión para la raíz que usa `Iniciar_Consulta.cmd`.
- `npm run build` ejecuta `build:consulta` antes de compilar el sitio, por lo que Vercel
  publica la consulta sin pasos adicionales.
- En desarrollo, ejecuta `npm run build:consulta` una vez y luego `npm run dev`
  (`vite.config.ts` sirve la consulta en `/consulta-presbiteriana/`). Tras cambiar
  `consulta-presbiteriana/src` o `consulta-presbiteriana/static`, vuelve a compilar.
- `vercel.json` reescribe `/consulta-presbiteriana` (sin barra final) a su `index.html`.
- La compilación de la consulta (SvelteKit + Vite 7) requiere Node.js 22.12 o posterior.

## Estructura

```
src/
  components/   Secciones de la landing (Hero, Horarios, Eventos, Contacto...)
  data/         Textos e información de la iglesia (editar aquí el contenido)
  lib/          Cliente de Supabase
supabase/       Esquema SQL y políticas RLS
consulta-presbiteriana/  App SvelteKit independiente publicada en /consulta-presbiteriana
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build:consulta` — compila la Consulta Presbiteriana en `public/consulta-presbiteriana/`
- `npm run build` — build de producción (incluye la consulta)
- `npm run preview` — previsualizar el build
