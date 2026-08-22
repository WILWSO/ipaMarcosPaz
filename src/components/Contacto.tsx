import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { iglesia } from '../data/contenido'
import { Mail, MapPin, Phone } from 'lucide-react'

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
    <section id="contacto" className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-0 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-6">
        <div className="bg-brand-800 p-7 text-white md:p-10">
          <p className="text-sm font-bold uppercase text-service-500">Estamos cerca</p>
          <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-3xl font-bold uppercase">Contacto</h2>
          <p className="mt-3 text-brand-100">
            Escribinos y nos pondremos en contacto con vos a la brevedad.
          </p>

          <dl className="mt-10 space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 shrink-0 text-service-500" aria-hidden="true" />
              <div><dt className="text-xs font-bold uppercase text-brand-300">
                Dirección
              </dt>
              <dd>
                <a
                  href={iglesia.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-semibold hover:text-service-500"
                >
                  {iglesia.direccion}
                </a>
              </dd></div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 shrink-0 text-service-500" aria-hidden="true" />
              <div><dt className="text-xs font-bold uppercase text-brand-300">
                Teléfono
              </dt>
              <dd className="mt-1 font-semibold">{iglesia.telefono}</dd></div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-1 shrink-0 text-service-500" aria-hidden="true" />
              <div><dt className="text-xs font-bold uppercase text-brand-300">
                Email
              </dt>
              <dd className="mt-1 font-semibold break-all">{iglesia.email}</dd></div>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-brand-100 bg-brand-50 p-7 md:p-10"
        >
          <div className="grid gap-4">
            <label className="text-sm font-medium text-brand-700">
              Nombre
              <input
                name="nombre"
                type="text"
                required
                maxLength={120}
                className="mt-2 w-full rounded-sm border border-brand-200 bg-white px-3 py-3 outline-none focus:border-service-500"
              />
            </label>
            <label className="text-sm font-medium text-brand-700">
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={160}
                className="mt-2 w-full rounded-sm border border-brand-200 bg-white px-3 py-3 outline-none focus:border-service-500"
              />
            </label>
            <label className="text-sm font-medium text-brand-700">
              Teléfono (opcional)
              <input
                name="telefono"
                type="tel"
                maxLength={40}
                className="mt-2 w-full rounded-sm border border-brand-200 bg-white px-3 py-3 outline-none focus:border-service-500"
              />
            </label>
            <label className="text-sm font-medium text-brand-700">
              Mensaje
              <textarea
                name="mensaje"
                required
                rows={4}
                maxLength={2000}
                className="mt-2 w-full rounded-sm border border-brand-200 bg-white px-3 py-3 outline-none focus:border-service-500"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="mt-6 w-full rounded-md bg-service-600 px-6 py-3 font-bold uppercase text-white transition hover:bg-service-700 disabled:opacity-60"
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
