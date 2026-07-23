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

    const { error: dbErr } = await admin.from('plaid_items').upsert({
      user_id: user.id,
      access_token: res.data.access_token,
      item_id: res.data.item_id
    })
    if (dbErr) {
      console.error('plaid-exchange: DB insert failed:', dbErr)
      return json(500, { error: 'Could not store bank connection' })
    }

    return json(200, { ok: true })
  } catch (err) {
    console.error('plaid-exchange-public-token error:', err)
    return json(500, { error: 'Could not exchange public token', detail: err.message })
  }
}
