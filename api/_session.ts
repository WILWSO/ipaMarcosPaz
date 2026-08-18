import { createHmac, timingSafeEqual } from 'node:crypto'
import { parseCookies, type VercelRequest, type VercelResponse } from './_http.js'

export interface SiteSession {
  email: string | null
  client_id: string
  tenant_id: string | null
  role: string | null
}

interface SignedSession extends SiteSession {
  exp: number
}

const sessionCookie = 'ipa_session'
const stateCookie = 'ipa_sso_state'
const sessionMaxAge = 28800
const stateMaxAge = 600

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error('SESSION_SECRET no configurado')
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

// En desarrollo local el sitio corre sobre http, donde `Secure` impediría enviar la cookie.
function attributes(maxAge: number) {
  const secure = process.env.VERCEL_ENV || process.env.NODE_ENV === 'production' ? ' Secure;' : ''
  return `HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=${maxAge}`
}

function appendCookie(res: VercelResponse, value: string) {
  const previous = res.getHeader('Set-Cookie')
  const list = Array.isArray(previous) ? previous : typeof previous === 'string' ? [previous] : []
  const cookies = [...list, value]
  res.setHeader('Set-Cookie', cookies.length === 1 ? cookies[0] : cookies)
}

export function encodeSession(session: SignedSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function decodeSession(value: string | undefined): SiteSession | null {
  if (!value) return null
  const [payload, signature] = value.split('.')
  if (!payload || !signature) return null
  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SignedSession
    if (typeof session.exp !== 'number' || session.exp < Math.floor(Date.now() / 1000)) return null
    return {
      email: session.email ?? null,
      client_id: session.client_id,
      tenant_id: session.tenant_id ?? null,
      role: session.role ?? null,
    }
  } catch {
    return null
  }
}

export function getSession(req: VercelRequest) {
  return decodeSession(parseCookies(req.headers.cookie)[sessionCookie])
}

export function setState(res: VercelResponse, state: string) {
  res.setHeader('Set-Cookie', `${stateCookie}=${encodeURIComponent(state)}; ${attributes(stateMaxAge)}`)
}

export function getState(req: VercelRequest) {
  return parseCookies(req.headers.cookie)[stateCookie]
}

export function clearState(res: VercelResponse) {
  appendCookie(res, `${stateCookie}=; ${attributes(0)}`)
}

export function clearCookies(res: VercelResponse) {
  clearState(res)
  appendCookie(res, `${sessionCookie}=; ${attributes(0)}`)
}

export function setSession(res: VercelResponse, session: SiteSession) {
  clearState(res)
  const signed = encodeSession({ ...session, exp: Math.floor(Date.now() / 1000) + sessionMaxAge })
  appendCookie(res, `${sessionCookie}=${encodeURIComponent(signed)}; ${attributes(sessionMaxAge)}`)
}
