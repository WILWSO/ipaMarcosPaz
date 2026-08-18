import { creencias, iglesia } from '../data/contenido'

export default function Nosotros() {
  return (
    <section id="nosotros" className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold text-brand-800">Quiénes somos</h2>
          <p className="mt-5 text-brand-700">
            Somos una congregación de la {iglesia.nombre} que se reúne en{' '}
            {iglesia.ciudad} para adorar a Dios, escuchar su Palabra y servir a
            la ciudad. Creemos que el evangelio de Jesucristo transforma
            personas, familias y comunidades.
          </p>
          <p className="mt-4 text-brand-700">
            Nuestras puertas están abiertas para todos: no importa tu historia ni
            en qué punto del camino estés, tenés un lugar entre nosotros.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {creencias.map((c) => (
            <article
              key={c.titulo}
              className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-brand-800">{c.titulo}</h3>
              <p className="mt-2 text-sm text-brand-600">{c.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
