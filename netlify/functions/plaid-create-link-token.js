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

exports.handler = async (event) => {
  const jwt = (event.headers.authorization || '').replace('Bearer ', '')
  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: { user }, error } = await admin.auth.getUser(jwt)
  if (error || !user) return { statusCode: 401, body: 'Unauthorized' }

  const res = await plaid.linkTokenCreate({
    user: { client_user_id: user.id },
    client_name: 'Storehouse',
    products: ['transactions'],
    country_codes: ['GB'],
    language: 'en'
  })
  return { statusCode: 200, body: JSON.stringify({ link_token: res.data.link_token }) }
}
