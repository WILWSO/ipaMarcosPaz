import { useState } from 'react'
import { enlaces, iglesia } from '../data/contenido'

const links = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#horarios', label: 'Horarios' },
  { href: '#ministerios', label: 'Ministerios' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#inicio" className="flex items-center gap-3">
          <span
            role="img"
            aria-label="Iglesia Presbiteriana Argentina"
            className="h-14 w-14 shrink-0 bg-brand-800 mask-[url('/ipamp.png')] mask-center mask-no-repeat mask-contain"
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-brand-800">
              {iglesia.nombre}
            </span>
            <span className="block text-xs text-brand-500">{iglesia.ciudad}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-brand-700 transition hover:text-accent-600"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={enlaces.areaPrivada}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Área privada
            </a>
          </li>
          <li>
            <a
              href={enlaces.solicitudMembresia}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-accent-500 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-accent-500 hover:text-brand-900"
            >
              Solicitar membresía
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
          className="rounded-md border border-brand-200 p-2 text-brand-700 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
      </nav>

      {abierto && (
        <ul className="border-t border-brand-100 bg-white px-4 py-2 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setAbierto(false)}
                className="block py-2 text-brand-700"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={enlaces.areaPrivada}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={() => setAbierto(false)}
              className="block py-2 font-semibold text-brand-800"
            >
              Área privada
            </a>
          </li>
          <li>
            <a
              href={enlaces.solicitudMembresia}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAbierto(false)}
              className="block py-2 font-semibold text-accent-600"
            >
              Solicitar membresía
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
