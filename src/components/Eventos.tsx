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
    titulo: 'Culto de acción de gracias',
    descripcion: 'Un tiempo especial de adoración junto a toda la congregación.',
    fecha: new Date(Date.now() + 7 * 86400000).toISOString(),
    lugar: 'Templo principal',
  },
  {
    id: 'demo-2',
    titulo: 'Retiro de jóvenes',
    descripcion: 'Fin de semana de enseñanza, comunión y descanso.',
    fecha: new Date(Date.now() + 21 * 86400000).toISOString(),
    lugar: 'Camping de Marcos Paz',
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
