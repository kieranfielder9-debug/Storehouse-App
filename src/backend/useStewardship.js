import { useEffect, useReducer } from 'react'
import { provider } from './provider.js'

/** Reactive hook: any Ledger/Goals mutation re-renders subscribers instantly. */
export function useStewardship() {
  const [, force] = useReducer((x) => x + 1, 0)
  useEffect(() => provider.subscribe(force), [])
  return {
    mode: provider.mode(),
    user: provider.getUser(),
    ledger: provider.getLedger(),
    goals: provider.getGoals(),
    stats: provider.computeStats(),
    plaid: provider.plaidStatus(),
    householdMembers: provider.getHouseholdMembers(),
    rewardRequests: provider.getRewardRequests(),
    provider
  }
}
