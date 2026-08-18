import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { iglesia } from '../data/contenido'

type Estado = 'idle' | 'enviando' | 'ok' | 'error'

export default function Contacto() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensajeError, setMensajeError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const datos = new FormData(form)

    const payload = {
      nombre: String(datos.get('nombre') ?? '').trim(),
      email: String(datos.get('email') ?? '').trim(),
      telefono: String(datos.get('telefono') ?? '').trim() || null,
      mensaje: String(datos.get('mensaje') ?? '').trim(),
    }

    if (!payload.nombre || !payload.email || !payload.mensaje) {
      setEstado('error')
      setMensajeError('Completá nombre, email y mensaje.')
      return
    }

    if (!supabase) {
      setEstado('error')
      setMensajeError(
        'El formulario aún no está conectado. Configurá las variables de Supabase.',
      )
      return
    }

    setEstado('enviando')
    const { error } = await supabase.from('mensajes').insert(payload)

    if (error) {
      setEstado('error')
      setMensajeError('No pudimos enviar tu mensaje. Intentá nuevamente.')
      return
    }

    form.reset()
    setEstado('ok')
  }

  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold text-brand-800">Contacto</h2>
          <p className="mt-3 text-brand-600">
            Escribinos y nos pondremos en contacto con vos a la brevedad.
          </p>

          <dl className="mt-8 space-y-4 text-brand-700">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                Dirección
              </dt>
              <dd>
                <a
                  href={iglesia.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-600"
                >
                  {iglesia.direccion}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                Teléfono
              </dt>
              <dd>{iglesia.telefono}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                Email
              </dt>
              <dd>{iglesia.email}</dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4">
            <label className="text-sm font-medium text-brand-700">
              Nombre
              <input
                name="nombre"
                type="text"
                required
                maxLength={120}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 outline-none focus:border-accent-500"
              />
            </label>
            <label className="text-sm font-medium text-brand-700">
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={160}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 outline-none focus:border-accent-500"
              />
            </label>
            <label className="text-sm font-medium text-brand-700">
              Teléfono (opcional)
              <input
                name="telefono"
                type="tel"
                maxLength={40}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 outline-none focus:border-accent-500"
              />
            </label>
            <label className="text-sm font-medium text-brand-700">
              Mensaje
              <textarea
                name="mensaje"
                required
                rows={4}
                maxLength={2000}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 outline-none focus:border-accent-500"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="mt-6 w-full rounded-full bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
          >
            {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
          </button>

          {estado === 'ok' && (
            <p className="mt-4 text-sm text-green-700">
              ¡Gracias! Recibimos tu mensaje.
            </p>
          )}
          {estado === 'error' && (
            <p className="mt-4 text-sm text-red-700">{mensajeError}</p>
          )}
        </form>
      </div>
    </section>
  )
}
