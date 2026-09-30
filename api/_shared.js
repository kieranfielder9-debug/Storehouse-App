// Shared setup for the Plaid serverless functions. The `_` prefix keeps
// Vercel from exposing this file as a route.
//
// Requires env: PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV
// (sandbox|development|production), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
import plaidPkg from 'plaid'
import { createClient } from '@supabase/supabase-js'

// plaid ships as CommonJS; importing the default and destructuring avoids
// relying on Node's named-export detection for CJS modules.
const { Configuration, PlaidApi, PlaidEnvironments } = plaidPkg

export const plaid = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: { headers: { 'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, 'PLAID-SECRET': process.env.PLAID_SECRET } }
}))

/** Verifies the caller's Supabase session from the Bearer token, before any
 *  database client is created. Returns { user, admin } (admin = service-role
 *  client), or null after already sending a 401. */
export async function requireUser(req, res) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '')
  if (!jwt) {
    res.status(401).json({ error: 'Missing authorization token' })
    return null
  }
  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: { user }, error } = await admin.auth.getUser(jwt)
  if (error || !user) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return { user, admin }
}

/** Never log a Plaid SDK error object itself: it is an AxiosError whose
 *  .config.headers carries PLAID-SECRET (and .config.data the request body,
 *  e.g. a public_token), so console.error(err) would write the secret into
 *  the function logs. Log only Plaid's own response body + status, or the
 *  bare message for non-HTTP failures. */
export function logPlaidError(label, err) {
  console.error(`${label} error:`, err.response
    ? { status: err.response.status, data: err.response.data }
    : { message: err.message })
}
