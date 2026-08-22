import { horarios } from '../data/contenido'
import { CalendarDays, Clock3 } from 'lucide-react'

export default function Horarios() {
  return (
    <section id="horarios" className="bg-brand-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.8fr]">
          <div>
            <p className="text-sm font-bold uppercase text-service-500">Nuestra semana</p>
            <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-3xl font-bold uppercase">Horarios de reuniones</h2>
            <p className="mt-4 max-w-sm leading-7 text-brand-200">Te esperamos en cualquiera de nuestros encuentros semanales. Hay un lugar para vos y tu familia.</p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-md bg-white/15 sm:grid-cols-2">
            {horarios.map((horario) => {
              const esConectados = horario.titulo === 'Conectados'
              return (
              <article key={`${horario.dia}-${horario.hora}`} className="bg-brand-800 p-5 transition hover:bg-brand-700">
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-service-500"><CalendarDays size={17} aria-hidden="true" />{horario.dia}</div>
                <div className="mt-3 flex items-center gap-2 text-2xl font-bold"><Clock3 size={21} aria-hidden="true" />{horario.hora}</div>
                {esConectados ? (
                  <img
                    src="/Recurso%202_white.png"
                    alt="Conectados"
                    className="mt-4 h-20 w-auto max-w-full object-contain object-left"
                  />
                ) : (
                  <h3 className="mt-3 font-bold text-white">{horario.titulo}</h3>
                )}
                <p className="mt-2 text-sm leading-6 text-brand-200">{horario.detalle}</p>
              </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
