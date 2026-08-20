import { useEffect, useState } from 'react'
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
    <section id="eventos" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold text-brand-800">
          Próximos eventos
        </h2>
        <p className="mt-3 max-w-2xl text-brand-600">
          {cargando ? 'Cargando agenda…' : 'Actividades y encuentros de la iglesia.'}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border border-brand-100 bg-brand-50 p-6"
            >
              <time
                dateTime={e.fecha}
                className="text-xs font-semibold uppercase tracking-widest text-accent-600"
              >
                {formato.format(new Date(e.fecha))}
              </time>
              <h3 className="mt-3 text-lg font-semibold text-brand-800">
                {e.titulo}
              </h3>
              {e.descripcion && (
                <p className="mt-2 text-sm text-brand-600">{e.descripcion}</p>
              )}
              {e.lugar && (
                <p className="mt-4 text-sm font-medium text-brand-700">
                  📍 {e.lugar}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
