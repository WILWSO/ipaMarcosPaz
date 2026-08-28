import { timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '../_http.js'
import { clearState, getState, setSession } from '../_session.js'

interface Identity {
  email?: string | null
  client_id?: string
  tenant_id?: string | null
  role?: string | null
}

function reject(res: VercelResponse, status: number, error: string) {
  clearState(res)
  return res.status(status).json({ error })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  const code = typeof req.query.code === 'string' ? req.query.code : null
  const state = typeof req.query.state === 'string' ? req.query.state : null
  const storedState = getState(req)
  if (!code || !state || !storedState) return reject(res, 400, 'Callback SSO incompleto')

  const incoming = Buffer.from(state)
  const expected = Buffer.from(storedState)
  if (incoming.length !== expected.length || !timingSafeEqual(incoming, expected)) {
    return reject(res, 400, 'State inválido')
  }

  const centralUrl = process.env.IGLESIANET_URL || 'http://localhost:5173'
  const clientId = process.env.IPA_CLIENT_ID || 'ipamarcospaz'
  const redirectUri = process.env.IPA_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
  const clientSecret = process.env.IPA_CLIENT_SECRET
  if (!centralUrl || !clientId || !redirectUri || !clientSecret) {
    return reject(res, 500, 'SSO no configurado')
  }

  let identity: Identity
  try {
    const response = await fetch(new URL('/auth/token', centralUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, client_id: clientId, redirect_uri: redirectUri, client_secret: clientSecret }),
    })
    if (!response.ok) return reject(res, 401, 'Código SSO inválido o expirado')
    identity = (await response.json()) as Identity
  } catch {
    return reject(res, 502, 'No se pudo contactar al servidor de autenticación')
  }

  if (identity.client_id !== clientId) return reject(res, 401, 'Cliente SSO inválido')

  setSession(res, {
    email: identity.email ?? null,
    client_id: clientId,
    tenant_id: identity.tenant_id ?? null,
    role: identity.role ?? null,
  })
  res.status(302).setHeader('Location', '/area-privada').end()
}
