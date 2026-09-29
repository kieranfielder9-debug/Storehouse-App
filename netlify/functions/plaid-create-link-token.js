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
    // Never log `err` itself: with the Plaid SDK it is an AxiosError whose
    // .config.headers carries PLAID-SECRET (and .config.data the request
    // body), so console.error(err) writes the secret into the Netlify logs.
    // Log only Plaid's own response body + status (or the bare message for
    // non-HTTP failures). Nothing internal goes back to the browser either.
    console.error('plaid-create-link-token error:', err.response
      ? { status: err.response.status, data: err.response.data }
      : { message: err.message })
    return json(500, { error: 'Could not create link token' })
  }
}
