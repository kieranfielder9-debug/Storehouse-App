// Exchanges a Plaid public_token for the permanent access_token and stores it
// in plaid_items via the service role (that table is deny-all to clients).
// The access token never reaches the browser or our client bundle.
import { plaid, requireUser, logPlaidError } from './_shared.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const auth = await requireUser(req, res)
    if (!auth) return
    const { user, admin } = auth

    // Vercel parses a JSON body lazily and throws on first access if it's
    // malformed — catch that here so it's a 400, not a 500.
    let body
    try { body = req.body || {} } catch { return res.status(400).json({ error: 'Invalid JSON body' }) }
    const { public_token } = body
    if (!public_token) return res.status(400).json({ error: 'Missing public_token' })

    const result = await plaid.itemPublicTokenExchange({ public_token })

    // onConflict: 'user_id' — one Plaid item per user, so re-linking a bank
    // replaces the row. Explicit so it works whether user_id is the primary key
    // (schema.sql) or a unique column beside a surrogate id (migration-001).
    const { error: dbErr } = await admin.from('plaid_items').upsert({
      user_id: user.id,
      access_token: result.data.access_token,
      item_id: result.data.item_id
    }, { onConflict: 'user_id' })
    if (dbErr) {
      // Code + message only: PostgREST's `details` can echo the failing row,
      // which here contains the access_token.
      console.error('plaid-exchange: DB upsert failed:', dbErr.code, dbErr.message)
      return res.status(500).json({ error: 'Could not store bank connection' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    logPlaidError('plaid-exchange-public-token', err)
    return res.status(500).json({ error: 'Could not exchange public token' })
  }
}
