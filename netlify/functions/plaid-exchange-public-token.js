// Exchanges a Plaid public_token for the permanent access_token and stores it
// in plaid_items via the service role (that table is deny-all to clients).
// The access token never reaches the browser or our client bundle.
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')
const { createClient } = require('@supabase/supabase-js')

const plaid = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: { headers: { 'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, 'PLAID-SECRET': process.env.PLAID_SECRET } }
}))

exports.handler = async (event) => {
  const jwt = (event.headers.authorization || '').replace('Bearer ', '')
  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: { user }, error } = await admin.auth.getUser(jwt)
  if (error || !user) return { statusCode: 401, body: 'Unauthorized' }

  const { public_token } = JSON.parse(event.body || '{}')
  const res = await plaid.itemPublicTokenExchange({ public_token })

  const { error: dbErr } = await admin.from('plaid_items').upsert({
    user_id: user.id,
    access_token: res.data.access_token,
    item_id: res.data.item_id
  })
  if (dbErr) return { statusCode: 500, body: dbErr.message }
  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
