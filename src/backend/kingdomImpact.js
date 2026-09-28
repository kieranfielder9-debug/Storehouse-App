/**
 * Kingdom Impact — turns real Giving-category ledger rows into friendly,
 * human-readable impact entries. Shared by the Dashboard's Recent Activity
 * Stream ("Kingdom Impacts" group) and Capital's Kingdom Impact Log so both
 * surfaces tell the same honest story from the same data, instead of two
 * independently-invented mock lists.
 *
 * Deliberately NOT paired with a fabricated cause/charity story — the
 * ledger only stores a free-text description (e.g. "Tithe — Huddersfield
 * Christian Fellowship" or "Compassion UK — Sponsorship"), and that
 * description already reads as the impact. Ported from the Expo rebuild's
 * MeasurementScreen.tsx, whose kingdomImpactLog was mock data; this version
 * is backed by the real ledger instead.
 */
export function deriveKingdomImpact(ledger) {
  return ledger
    .filter((r) => r.category === 'Giving' && r.amount < 0)
    .map((r) => ({
      id: `impact-${r.id}`,
      title: r.description || 'Kingdom giving',
      subtitle: formatRelativeDate(r.date),
      amount: Math.abs(r.amount),
      amountLabel: `£${Math.abs(r.amount).toFixed(2)}`
    }))
}

function formatRelativeDate(dateStr) {
  const d = new Date(dateStr)
  const days = Math.round((Date.now() - d.getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
