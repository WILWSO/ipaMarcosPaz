import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { enlaces, iglesia } from '../data/contenido'

type EnlaceMenu = { href: string; label: string; titulo?: string; externo?: boolean }

const links: EnlaceMenu[] = [
  { href: '#nosotros', label: 'Quiénes somos' },
  { href: '#fe', label: 'Nuestra fe' },
  { href: '#ministerios', label: 'Ministerios' },
  { href: '#eventos', label: 'Actividades' },
  { href: '#recursos', label: 'Recursos' },
  {
    href: enlaces.consultaPresbiteriana,
    label: 'Consulta',
    titulo: 'Consulta Presbiteriana: Manual 2025 y Digesto 2026 (se abre en una pestaña nueva)',
    externo: true,
  },
  { href: '#contacto', label: 'Contacto' },
]

const pestanaNueva = { target: '_blank', rel: 'noopener noreferrer' }

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

        <ul className="hidden items-center gap-4 lg:flex xl:gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                title={l.titulo}
                {...(l.externo ? pestanaNueva : {})}
                className="inline-flex items-center gap-0.5 whitespace-nowrap border-b-2 border-transparent py-2 text-xs font-bold uppercase text-brand-800 transition hover:border-brand-700"
              >
                {l.label}
                {l.externo && <ArrowUpRight aria-hidden="true" className="h-3 w-3" />}
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
                title={l.titulo}
                {...(l.externo ? pestanaNueva : {})}
                onClick={() => setAbierto(false)}
                className="flex items-center gap-1 border-b border-brand-100 py-3 text-sm font-bold uppercase text-brand-800 last:border-0"
              >
                {l.label}
                {l.externo && <ArrowUpRight aria-hidden="true" className="h-4 w-4" />}
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
