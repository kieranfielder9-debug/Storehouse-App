// Removes a Plaid item: invalidates the access token at Plaid (itemRemove)
// and deletes the plaid_items row from the database. Called when a user
// disconnects their bank — the token is no longer valid at Plaid after this,
// not just hidden in the UI.
//
// Requires env: PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV,
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')
const { createClient } = require('@supabase/supabase-js')

const plaid = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: { headers: { 'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, 'PLAID-SECRET': process.env.PLAID_SECRET } }
}))

function json(statusCode, body) {
  return { statusCode, body: JSON.stringify(body) }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  try {
    const jwt = (event.headers.authorization || '').replace('Bearer ', '')
    if (!jwt) return json(401, { error: 'Missing authorization token' })

    const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const { data: { user }, error } = await admin.auth.getUser(jwt)
    if (error || !user) return json(401, { error: 'Unauthorized' })

    // Fetch the user's Plaid item (service role bypasses RLS)
    const { data: item, error: fetchErr } = await admin
      .from('plaid_items')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !item) {
      // No Plaid item to remove — already disconnected. Not an error.
      return json(200, { ok: true, message: 'No bank connection to remove' })
    }

    // Invalidate the token at Plaid
    try {
      await plaid.itemRemove({ access_token: item.access_token })
    } catch (plaidErr) {
      // If Plaid already invalidated it (e.g. user removed it from their
      // bank's side), the item_remove call fails — log but continue to
      // delete the DB row so we're not left with a dead token stored.
      console.warn('plaid-remove-item: Plaid API call failed (token may already be invalid):', plaidErr.message)
    }

    // Delete the DB row
    const { error: dbErr } = await admin.from('plaid_items').delete().eq('user_id', user.id)
    if (dbErr) {
      console.error('plaid-remove-item: DB delete failed:', dbErr)
      return json(500, { error: 'Could not remove bank connection from database' })
    }

    return json(200, { ok: true })
  } catch (err) {
    console.error('plaid-remove-item error:', err)
    return json(500, { error: 'Could not remove bank connection', detail: err.message })
  }
}
