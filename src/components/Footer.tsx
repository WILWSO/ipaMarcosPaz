import { iglesia } from '../data/contenido'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-white">{iglesia.nombre}</p>
          <p className="mt-1 text-sm">{iglesia.ciudad}, {iglesia.provincia}</p>
        </div>
        <div className="text-sm">
          <p>{iglesia.direccion}</p>
          <p className="mt-1">{iglesia.telefono}</p>
          <p className="mt-1">{iglesia.email}</p>
        </div>
        <div className="flex gap-4 text-sm sm:justify-end">
          <a
            href={iglesia.redes.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-400"
          >
            Instagram
          </a>
          <a
            href={iglesia.redes.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-400"
          >
            Facebook
          </a>
          <a
            href={iglesia.redes.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-400"
          >
            YouTube
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} {iglesia.nombre} de {iglesia.ciudad}
      </div>
    </footer>
  )
}
