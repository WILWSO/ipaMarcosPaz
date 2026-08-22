import { iglesia } from '../data/contenido'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
        <div className="flex items-start gap-4">
          <img src="/ipa_white.svg" alt="" className="h-16 w-16 object-contain" />
          <div><p className="font-bold uppercase text-white">{iglesia.nombre}</p>
          <p className="mt-1 text-sm">{iglesia.ciudad}, {iglesia.provincia}</p></div>
        </div>
        <div className="text-sm">
          <p>{iglesia.direccion}</p>
          <p className="mt-1">{iglesia.telefono}</p>
          <p className="mt-1">{iglesia.email}</p>
        </div>
        <div className="flex flex-wrap content-start gap-x-4 gap-y-2 text-sm md:justify-end">
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
          <a
            href={iglesia.redes.pastor}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-400"
          >
            Pastor
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 text-center text-xs">
        © {new Date().getFullYear()} {iglesia.nombre} de {iglesia.ciudad}
      </div>
      <div className="pb-4 pt-3 text-center text-xs text-brand-300">
        <span>Desarrollado por </span>
        <a
          href="https://github.com/WILWSO"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub del desarrollador"
          className="inline-flex items-center align-middle transition-opacity hover:opacity-80"
        >
          <img src="/wso.svg" alt="WSolutions" className="ml-1 h-6 w-auto" />
        </a>
      </div>
    </footer>
  )
}
