// Exchanges a Plaid public_token for the permanent access_token and stores it
// in plaid_items via the service role (that table is deny-all to clients).
// The access token never reaches the browser or our client bundle.
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

    let body
    try { body = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Invalid JSON body' }) }
    const { public_token } = body
    if (!public_token) return json(400, { error: 'Missing public_token' })

    const res = await plaid.itemPublicTokenExchange({ public_token })

    // onConflict: 'user_id' — one Plaid item per user, so re-linking a bank
    // replaces the row. Explicit so it works whether user_id is the primary key
    // (schema.sql) or a unique column beside a surrogate id (migration-001).
    const { error: dbErr } = await admin.from('plaid_items').upsert({
      user_id: user.id,
      access_token: res.data.access_token,
      item_id: res.data.item_id
    }, { onConflict: 'user_id' })
    if (dbErr) {
      // Code + message only: PostgREST's `details` can echo the failing row,
      // which here contains the access_token.
      console.error('plaid-exchange: DB upsert failed:', dbErr.code, dbErr.message)
      return json(500, { error: 'Could not store bank connection' })
    }

    return json(200, { ok: true })
  } catch (err) {
    // Never log `err` itself: with the Plaid SDK it is an AxiosError whose
    // .config.headers carries PLAID-SECRET and .config.data the public_token.
    // Log only Plaid's own response body + status (or the bare message for
    // non-HTTP failures). Nothing internal goes back to the browser either.
    console.error('plaid-exchange-public-token error:', err.response
      ? { status: err.response.status, data: err.response.data }
      : { message: err.message })
    return json(500, { error: 'Could not exchange public token' })
  }
}
