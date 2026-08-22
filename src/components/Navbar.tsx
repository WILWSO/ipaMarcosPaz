import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { enlaces, iglesia } from '../data/contenido'

const links = [
  { href: '#nosotros', label: 'Quiénes somos' },
  { href: '#fe', label: 'Nuestra fe' },
  { href: '#ministerios', label: 'Ministerios' },
  { href: '#eventos', label: 'Actividades' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 lg:px-6">
        <a href="#inicio" className="flex items-center gap-3">
          <img src="/ipa2_favicon.svg" alt="" className="h-14 w-14 shrink-0 object-contain" />
          <span className="max-w-48 leading-tight">
            <span className="block text-sm font-extrabold text-brand-800">
              {iglesia.nombre}
            </span>
            <span className="block text-xs font-medium text-brand-500">{iglesia.ciudad}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-4 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="border-b-2 border-transparent py-2 text-xs font-bold uppercase text-brand-800 transition hover:border-brand-700"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <a
            href={enlaces.areaPrivada}
            className="rounded-md bg-brand-800 px-4 py-3 text-xs font-bold uppercase text-white transition hover:bg-brand-900"
          >
            Área privada
          </a>
          <a
            href={enlaces.solicitudMembresia}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-service-600 px-4 py-3 text-xs font-bold uppercase text-white transition hover:bg-service-700"
          >
            Solicitud de membresía
          </a>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
          className="grid h-11 w-11 place-items-center text-brand-800 lg:hidden"
        >
          {abierto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {abierto && (
        <ul className="border-t border-brand-100 bg-white px-5 py-3 shadow-lg lg:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setAbierto(false)}
                className="block border-b border-brand-100 py-3 text-sm font-bold uppercase text-brand-800 last:border-0"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="grid gap-2 py-3 sm:grid-cols-2">
            <a href={enlaces.areaPrivada} className="rounded-md bg-brand-800 px-4 py-3 text-center text-sm font-bold uppercase text-white">
              Área privada
            </a>
            <a href={enlaces.solicitudMembresia} target="_blank" rel="noopener noreferrer" className="rounded-md bg-service-600 px-4 py-3 text-center text-sm font-bold uppercase text-white">
              Solicitud de membresía
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
