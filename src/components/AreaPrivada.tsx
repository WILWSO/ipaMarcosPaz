import { useEffect, useState } from 'react'

type Session = {
  email: string | null
  client_id: string
  tenant_id: string | null
  role: string | null
}

export default function AreaPrivada() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(async (response) => {
        if (!response.ok) return null
        return response.json() as Promise<{ authenticated: boolean } & Session>
      })
      .then((data) => setSession(data?.authenticated ? data : null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="mx-auto max-w-3xl px-4 py-16">Cargando sesión...</main>
  if (!session) {
    window.location.href = '/api/auth/start'
    return <main className="mx-auto max-w-3xl px-4 py-16">Redirigiendo al acceso...</main>
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-xl border border-brand-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Área privada</p>
        <h1 className="mt-2 text-3xl font-bold text-brand-900">Bienvenido</h1>
        <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-brand-500">Correo</dt><dd className="font-semibold text-brand-900">{session.email}</dd></div>
          <div><dt className="text-brand-500">Rol</dt><dd className="font-semibold text-brand-900">{session.role}</dd></div>
          <div><dt className="text-brand-500">Institución</dt><dd className="font-semibold text-brand-900">{session.client_id}</dd></div>
          <div><dt className="text-brand-500">Congregación</dt><dd className="font-semibold text-brand-900">{session.tenant_id ?? 'Pendiente de selección'}</dd></div>
        </dl>
        <button onClick={() => { window.location.href = '/api/auth/logout' }} className="mt-8 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}
