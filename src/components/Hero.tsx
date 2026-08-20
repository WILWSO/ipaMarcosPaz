import { enlaces, iglesia } from '../data/contenido'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-800 text-white"
    >
      <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-400">
          {iglesia.ciudad} &middot; {iglesia.provincia}
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          {iglesia.nombre} de {iglesia.ciudad}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-100">
          {iglesia.lema}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#horarios"
            className="rounded-full bg-accent-500 px-7 py-3 font-semibold text-brand-900 transition hover:bg-accent-400"
          >
            Ver horarios de culto
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-white/40 px-7 py-3 font-semibold transition hover:bg-white/10"
          >
            Quiero visitarlos
          </a>
          <a
            href={enlaces.solicitudMembresia}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-accent-400 px-7 py-3 font-semibold text-accent-400 transition hover:bg-accent-500 hover:text-brand-900"
          >
            Solicitar membresía
          </a>
        </div>
      </div>
    </section>
  )
}
