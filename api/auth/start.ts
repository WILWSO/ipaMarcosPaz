import { randomBytes } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '../_http'
import { setState } from '../_session'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const centralUrl = process.env.IGLESIANET_URL
  const redirectUri = process.env.IPA_REDIRECT_URI
  const clientId = process.env.IPA_CLIENT_ID
  res.setHeader('Cache-Control', 'no-store')
  if (!centralUrl || !redirectUri || !clientId) {
    return res.status(500).json({ error: 'SSO no configurado' })
  }

  const state = randomBytes(32).toString('base64url')
  setState(res, state)
  const authorize = new URL('/auth/authorize', centralUrl)
  authorize.searchParams.set('client_id', clientId)
  authorize.searchParams.set('redirect_uri', redirectUri)
  authorize.searchParams.set('state', state)
  res.status(302).setHeader('Location', authorize.toString()).end()
}
