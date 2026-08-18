import { ministerios } from '../data/contenido'

export default function Ministerios() {
  return (
    <section id="ministerios" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl font-semibold text-brand-800">Ministerios</h2>
      <p className="mt-3 max-w-2xl text-brand-600">
        Espacios donde crecemos juntos y servimos a nuestra ciudad.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ministerios.map((m) => (
          <article
            key={m.titulo}
            className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-brand-800">{m.titulo}</h3>
            <p className="mt-2 text-sm text-brand-600">{m.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
