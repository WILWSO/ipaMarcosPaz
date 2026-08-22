import { ministerios } from '../data/contenido'
import { Baby, BookOpen, HandHeart, HeartHandshake, House, Megaphone, Music2, Sparkles, Users } from 'lucide-react'

const iconos = [Sparkles, Users, HandHeart, Megaphone, House, Music2, HeartHandshake, Users, Baby]

export default function Ministerios() {
  return (
    <section id="ministerios" className="bg-brand-50 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-service-600">Vida en comunidad</p>
            <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-3xl font-bold uppercase text-brand-800">Ministerios</h2>
          </div>
          <p className="max-w-xl leading-7 text-brand-600">Espacios donde crecemos juntos, desarrollamos nuestros dones y servimos a nuestra ciudad.</p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-md bg-brand-200 sm:grid-cols-2 lg:grid-cols-3">
          {ministerios.map((ministerio, index) => {
            const Icono = iconos[index] ?? BookOpen
            const esConectados = ministerio.titulo === 'Conectados'
            return (
              <article key={ministerio.titulo} className="group bg-white p-6 transition hover:bg-brand-800">
                {esConectados ? (
                  <img
                    src="/Conectados.png"
                    alt="Conectados"
                    className="h-20 w-auto max-w-full object-contain object-left transition group-hover:invert"
                  />
                ) : (
                  <Icono className="h-9 w-9 text-service-600 transition group-hover:text-service-500" strokeWidth={1.7} aria-hidden="true" />
                )}
                {!esConectados && <h3 className="mt-5 text-lg font-bold uppercase text-brand-800 transition group-hover:text-white">{ministerio.titulo}</h3>}
                <p className="mt-2 text-sm leading-6 text-brand-600 transition group-hover:text-brand-100">{ministerio.descripcion}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
