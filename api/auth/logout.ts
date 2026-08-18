import type { VercelRequest, VercelResponse } from '../_http'
import { clearCookies } from '../_session'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  clearCookies(res)
  res.setHeader('Cache-Control', 'no-store')
  res.status(302).setHeader('Location', '/').end()
}
