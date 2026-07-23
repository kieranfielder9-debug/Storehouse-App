// Creates a Plaid Link token for the signed-in user.
// The browser NEVER sees Plaid secrets or bank credentials — only this
// short-lived link_token. Requires env: PLAID_CLIENT_ID, PLAID_SECRET,
// PLAID_ENV (sandbox|development|production), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
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

    const res = await plaid.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: 'Storehouse',
      products: ['transactions'],
      country_codes: ['GB'],
      language: 'en'
    })

    return json(200, { link_token: res.data.link_token })
  } catch (err) {
    console.error('plaid-create-link-token error:', err)
    return json(500, { error: 'Could not create link token', detail: err.message })
  }
}
