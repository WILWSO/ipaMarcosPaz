import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Compila consulta-presbiteriana/ (SvelteKit) dentro de public/ para que Vite y Vercel la
// publiquen en /consulta-presbiteriana/. No toca consulta-presbiteriana/build (paquete local).
const raiz = fileURLToPath(new URL('..', import.meta.url))
const proyecto = join(raiz, 'consulta-presbiteriana')
const salida = join(raiz, 'public', 'consulta-presbiteriana')

function npm(args, env = {}) {
  const { status, error } = spawnSync('npm', args, {
    cwd: proyecto,
    env: { ...process.env, ...env },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (error || status !== 0) {
    console.error(`Falló "npm ${args.join(' ')}" en consulta-presbiteriana/`, error?.message ?? '')
    process.exit(status ?? 1)
  }
}

if (!existsSync(join(proyecto, 'package.json'))) {
  console.error('No se encontró consulta-presbiteriana/package.json')
  process.exit(1)
}

// --include=dev: SvelteKit y Vite son devDependencies aunque NODE_ENV=production.
if (!existsSync(join(proyecto, 'node_modules', '@sveltejs', 'kit', 'package.json'))) {
  npm(['ci', '--include=dev', '--no-audit', '--no-fund'])
}

npm(['run', 'build'], { BASE_PATH: '/consulta-presbiteriana', BUILD_DIR: salida })
