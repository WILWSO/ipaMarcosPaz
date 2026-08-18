import { horarios } from '../data/contenido'

export default function Horarios() {
  return (
    <section id="horarios" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold text-brand-800">
          Horarios de reuniones
        </h2>
        <p className="mt-3 max-w-2xl text-brand-600">
          Te esperamos en cualquiera de nuestros encuentros semanales.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {horarios.map((h) => (
            <article
              key={`${h.dia}-${h.hora}`}
              className="flex flex-col rounded-2xl border border-brand-100 bg-brand-50 p-6 transition hover:border-accent-400"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                {h.dia}
              </span>
              <span className="mt-2 text-2xl font-semibold text-brand-800">
                {h.hora}
              </span>
              <h3 className="mt-3 font-medium text-brand-700">{h.titulo}</h3>
              <p className="mt-2 text-sm text-brand-600">{h.detalle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
