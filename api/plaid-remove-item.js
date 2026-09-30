// Removes a Plaid item: invalidates the access token at Plaid (itemRemove)
// and deletes the plaid_items row from the database. Called when a user
// disconnects their bank — the token is no longer valid at Plaid after this,
// not just hidden in the UI.
import { plaid, requireUser, logPlaidError } from './_shared.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const auth = await requireUser(req, res)
    if (!auth) return
    const { user, admin } = auth

    // Fetch the user's Plaid item (service role bypasses RLS)
    const { data: item, error: fetchErr } = await admin
      .from('plaid_items')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !item) {
      // No Plaid item to remove — already disconnected. Not an error.
      return res.status(200).json({ ok: true, message: 'No bank connection to remove' })
    }

    try {
      await plaid.itemRemove({ access_token: item.access_token })
    } catch (plaidErr) {
      // If Plaid already invalidated it (e.g. user removed it from their
      // bank's side), the item_remove call fails — log but continue to
      // delete the DB row so we're not left with a dead token stored.
      console.warn('plaid-remove-item: Plaid API call failed (token may already be invalid):', plaidErr.message)
    }

    const { error: dbErr } = await admin.from('plaid_items').delete().eq('user_id', user.id)
    if (dbErr) {
      console.error('plaid-remove-item: DB delete failed:', dbErr.code, dbErr.message)
      return res.status(500).json({ error: 'Could not remove bank connection from database' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    logPlaidError('plaid-remove-item', err)
    return res.status(500).json({ error: 'Could not remove bank connection' })
  }
}
