import type { VercelRequest, VercelResponse } from '../_http'
import { getSession } from '../_session'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  const session = getSession(req)
  if (!session) return res.status(401).json({ authenticated: false })
  res.status(200).json({ authenticated: true, ...session })
}
