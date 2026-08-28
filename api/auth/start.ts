import { randomBytes } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '../_http.js'
import { setState } from '../_session.js'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const clean = (value: string | undefined, fallback: string) =>
    (value || fallback).replace(/[\u0000-\u001f\u007f]/g, '').trim()
  const centralUrl = clean(process.env.IGLESIANET_URL, 'http://localhost:5173').replace(/\/$/, '')
  const redirectUri = clean(process.env.IPA_REDIRECT_URI, 'http://localhost:3000/api/auth/callback')
  const clientId = clean(process.env.IPA_CLIENT_ID, 'ipamarcospaz')
  res.setHeader('Cache-Control', 'no-store')
  if (!centralUrl || !redirectUri || !clientId) {
    return res.status(500).json({ error: 'SSO no configurado' })
  }

  const state = randomBytes(32).toString('base64url')
  setState(res, state)
  const query = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, state })
  const location = `${centralUrl}/auth/authorize?${query.toString()}`
  if (!/^https?:\/\/[^\s]+$/.test(location)) {
    return res.status(500).json({ error: 'Configuración SSO inválida' })
  }
  res.setHeader('Location', location)
  res.status(302)
  res.end()
}
