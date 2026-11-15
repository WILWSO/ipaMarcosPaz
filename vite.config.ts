import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// La consulta compilada (npm run build:consulta) vive en public/consulta-presbiteriana/; sin
// esto el fallback SPA de Vite respondería con el index.html del sitio en /consulta-presbiteriana.
// En producción lo resuelve el rewrite de vercel.json.
const servirConsulta: Connect.NextHandleFunction = (req, _res, next) => {
  if (req.url && /^\/consulta-presbiteriana\/?(\?|$)/.test(req.url)) {
    req.url = req.url.replace(/^\/consulta-presbiteriana\/?/, '/consulta-presbiteriana/index.html')
  }
  next()
}

function consultaPresbiteriana(): Plugin {
  return {
    name: 'consulta-presbiteriana',
    configureServer(server) {
      server.middlewares.use(servirConsulta)
    },
    configurePreviewServer(server) {
      server.middlewares.use(servirConsulta)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), consultaPresbiteriana()],
})
