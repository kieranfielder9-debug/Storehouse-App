// Creates a Plaid Link token for the signed-in user.
// The browser NEVER sees Plaid secrets or bank credentials — only this
// short-lived link_token.
import { plaid, requireUser, logPlaidError } from './_shared.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const auth = await requireUser(req, res)
    if (!auth) return
    const { user } = auth

    const result = await plaid.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: 'Storehouse',
      products: ['transactions'],
      country_codes: ['GB'],
      language: 'en'
    })

    return res.status(200).json({ link_token: result.data.link_token })
  } catch (err) {
    logPlaidError('plaid-create-link-token', err)
    // Nothing internal goes back to the browser.
    return res.status(500).json({ error: 'Could not create link token' })
  }
}
