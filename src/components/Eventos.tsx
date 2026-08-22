import { useEffect, useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase'

export type Evento = {
  id: string
  titulo: string
  descripcion: string | null
  fecha: string
  lugar: string | null
}

const eventosDemo: Evento[] = [
  {
    id: 'demo-1',
    titulo: 'Intensivo del módulo 5 de Catecúmenos',
    descripcion:
      'Domingos 6 y 13 de septiembre, de 12:40 a 14:00 hs. Curso para toda la iglesia sobre membresía, derechos y deberes, disciplina, gobierno de la iglesia, oficiales y mayordomía cristiana.',
    fecha: '2026-09-06T12:40:00-03:00',
    lugar: 'Iglesia Presbiteriana de Marcos Paz',
  },
  {
    id: 'demo-2',
    titulo: 'Conmemoración del Día de la Reforma',
    descripcion:
      'Encuentro conmemorativo de la Reforma Protestante, de 10:00 a 13:00 hs.',
    fecha: '2026-10-10T10:00:00-03:00',
    lugar: 'Iglesia de Capital Federal, Hipólito Yrigoyen 1174',
  },
  {
    id: 'demo-3',
    titulo: 'Viaje a Brasil - Semana Santa 2027',
    descripcion:
      'Comunión con iglesias de cuatro países, con paseo por Paraguay y las Cataratas del Iguazú.',
    fecha: '2027-03-25T09:00:00-03:00',
    lugar: 'Brasil, Paraguay y Cataratas del Iguazú',
  },
]

const formato = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

const formatoMes = new Intl.DateTimeFormat('es-AR', { month: 'short' })

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>(eventosDemo)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!supabase) return

    let activo = true
    setCargando(true)

    supabase
      .from('eventos')
      .select('id, titulo, descripcion, fecha, lugar')
      .gte('fecha', new Date().toISOString())
      .order('fecha', { ascending: true })
      .limit(6)
      .then(({ data, error }) => {
        if (!activo) return
        if (!error && data?.length) setEventos(data as Evento[])
        setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return (
    <section id="eventos" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase text-service-600"><CalendarDays size={18} aria-hidden="true" />Agenda</p>
            <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-3xl font-bold uppercase text-brand-800">Próximos eventos</h2>
          </div>
          <p className="max-w-xl text-brand-600">
          {cargando ? 'Cargando agenda…' : 'Actividades y encuentros de la iglesia.'}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((e) => {
            const fecha = new Date(e.fecha)
            return (
            <article
              key={e.id}
              className="border border-brand-100 bg-brand-50 p-6 transition hover:border-brand-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <time dateTime={e.fecha} className="grid w-14 shrink-0 place-items-center bg-brand-800 px-2 py-2 text-center text-white">
                  <strong className="text-2xl leading-none">{fecha.getDate()}</strong>
                  <span className="mt-1 text-xs font-bold uppercase">{formatoMes.format(fecha)}</span>
                </time>
                <div>
                  <p className="text-xs font-bold uppercase text-service-600">{formato.format(fecha)}</p>
                  <h3 className="mt-2 text-lg font-bold text-brand-800">
                {e.titulo}
                  </h3>
                </div>
              </div>
              {e.descripcion && (
                <p className="mt-5 text-sm leading-6 text-brand-600">{e.descripcion}</p>
              )}
              {e.lugar && (
                <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-700">
                  <MapPin className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                  {e.lugar}
                </p>
              )}
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
