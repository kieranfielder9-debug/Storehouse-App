> **DRAFT — for the founder's review. Not yet reviewed by a solicitor. Do not publish live until reviewed.**
>
> This document is a first-pass draft written by an AI compliance-strategist role against Storehouse's actual database schema as of July 2026. It is directional guidance built from public ICO/UK GDPR sources, not a solicitor's opinion, and it has not been checked by one. Do not link this from a live signup page, and do not treat it as legally sufficient, until a solicitor (or a service like Rocket Lawyer/Seed Legal reviewed by one) has read it. Regulatory fee figures below were checked in July 2026 and should be re-verified before publishing, as they change.

# Storehouse Privacy Notice

**Last updated:** [date] · **Draft version**

Storehouse is a personal finance app built to help people manage money faithfully — tracking spending, tithing, saving, and reflecting, with room for the family (not strangers) to be part of that. This notice explains, plainly, what personal data we collect when you use Storehouse, why, and what rights you have over it.

We try to write our legal documents the way we write the rest of the app: honestly, without jargon we wouldn't use ourselves, and without hiding behind boilerplate. If something here is unclear, contact us — see the last section.

---

## 1. Who we are

Storehouse is operated by [account owner / company name], the data controller for the personal data described in this notice. We're a small, early-stage product — at the time of writing, a single founder rather than a large company — and this notice will be updated as that changes.

**Contact:** [contact email]

We are [registered / in the process of registering] with the UK Information Commissioner's Office (ICO), as required for any organisation processing personal data. [ICO registration reference: TBD].

---

## 2. What personal data we collect

Storehouse only collects what the app actually needs to work. Here is everything, matched to what's really stored in our database — not a generic list:

| Category | What it is | Where it lives |
|---|---|---|
| **Account details** | Your name and email address, created when you sign up | `users` table |
| **Stewardship goals** | Your tithe percentage and generosity target — numbers you set yourself | `stewardship_goals` table |
| **Ledger entries** | Transactions you enter by hand: date, amount, category, a free-text description, and an optional "need or want" marker | `ledger` table |
| **Reflections** | Free-text journal entries you choose to write inside the app — these can be personal and, if you write about your faith or giving, may touch on your religious beliefs | `reflections` table |
| **Household member records** | If you add a family member (for example, a child, for the Wisdom Wallet feature), we store their name and relationship to you (e.g. "child"). This is **not** a separate account or login for that person — it's a record you, the account owner, manage on their behalf | `household_members` table |
| **Reward approvals** | If you approve a reward for a household member, we store the amount, the reason, and the approval status/timestamp | `reward_requests` table |
| **Bank connection data (not yet active)** | Storehouse has a database table ready to store a bank-connection token (via Plaid) if and when automated bank sync goes live. **As of this draft, this feature is not switched on for real users** — any bank data you see in the app today is simulated/sandbox data, not a real connection to your bank. We're telling you about it now, before it's live, so this notice stays honest as the feature turns on rather than needing a rewrite after the fact | `plaid_items` table |

We do not collect more than this. We don't buy data about you from third parties, and we don't run advertising trackers.

### A note on "special category" data

Some of what you enter — reflections about your faith, tithe/giving figures, categories like "Tithe" or "Church" in your ledger — can count in UK GDPR terms as data about your religious beliefs. This is treated as **special category data**, which the law holds to a higher standard than ordinary personal data. Section 6 below explains exactly how we handle that, including a separate consent step at signup.

---

## 3. Why we collect it, and our lawful basis

UK GDPR requires us to have a specific lawful basis for each thing we do with your data. Here's ours, plainly:

- **Account details, ledger, stewardship goals, household records, reward approvals** — these exist because they *are* the service. Our lawful basis is **performance of a contract**: you've asked us to provide a personal finance tool, and we can't do that without storing what you enter into it. We don't need — and don't ask for — separate consent for this core functionality.
- **Reflections and any religious/giving data specifically** — our lawful basis is **explicit consent** (UK GDPR Article 9(2)(a)), given separately from your general acceptance of these terms, at the point you first use that part of the app. See Section 6.
- **Bank connection data (once active)** — will also be performance of a contract, since you'll have explicitly asked us to link an account, plus any additional consent Plaid or the FCA require at that time. We'll update this notice again before that feature goes live.

We do not use your data for automated decision-making that has a legal or similarly significant effect on you, and we do not use it for marketing profiling.

---

## 4. How long we keep it

We keep your personal data for as long as your account is active, so the app can keep working the way you'd expect (your ledger history, your goals, your reflections, your household records).

If you delete your account (Section 8), we delete your personal data — including reflections, ledger entries, and household member records — rather than retaining it indefinitely. We may keep a minimal record (for example, that an account existed and was deleted, without the underlying content) for a short period where we have a legal or security reason to, but not as a default.

We don't currently have a fixed backup-retention window written down; a solicitor should help us commit to a specific one (for example, "purged from backups within 30 days") before this goes live.

---

## 5. Who we share it with

We use a small number of service providers to run Storehouse. They process data on our behalf as **data processors** — they don't get to use your data for their own purposes.

- **Supabase** — our database, authentication, and real-time backend provider. All of the tables listed in Section 2 live in Supabase's infrastructure. Every table is protected by row-level security, meaning the database itself enforces that you can only ever read or write your own data — not just the application code.
- **Netlify** — hosts the Storehouse web app and its serverless functions.
- **Plaid** — a bank-connection provider. **Not yet active.** If and when real bank sync launches, Plaid would receive what's needed to establish and maintain that connection (see Section 2). We will not turn this on quietly; this notice will be updated and you'll be asked for fresh consent tied specifically to that feature.

We do not sell your data. We do not share it with advertisers. We would only share it with a regulator or law enforcement body where we're legally required to.

If Storehouse is ever acquired, merged, or restructured, personal data may transfer as part of that — but only under the same protections described here, and we'd tell you first.

---

## 6. Your faith and giving data — separate, explicit consent

We take this seriously enough to call it out on its own, not fold it into a general "I agree to the terms" tick-box.

Some of what Storehouse invites you to enter — tithe and generosity figures, giving categories, and especially free-text reflections — can reveal something about your religious beliefs or practice. Under UK data protection law, that's "special category data," and we're required to get your **explicit, opt-in** consent for it, separately from the rest of these terms.

**What that looks like in practice:** the reflections journal and any giving/tithe-specific fields are not enabled by default. Before you can use them, you'll see a separate, unticked checkbox — something like:

> ☐ **I'd like to use Storehouse's reflections journal and giving tools.**
> These let you write personal reflections and track tithing/giving. Because this can reveal information about your faith or religious practice, we're required to ask for your specific, separate permission before turning it on — and we mean that as more than a formality. You can switch this off at any time in Settings, and doing so deletes the reflections and giving-specific data we've stored for you. Ledger tracking, budgeting, and the rest of Storehouse work fine without this.
>
> [ I agree ] [ Not right now ]

This is opt-in, not opt-out: nothing here is switched on for you by default, it's never pre-ticked, and declining it doesn't block you from using the core budgeting features of the app. You can change your mind at any time in Settings.

---

## 7. International transfers

Supabase and Netlify may process or store data outside the UK (for example, in the EU or US), depending on their own infrastructure choices. Where that happens, it's covered by their own standard contractual clauses / adequacy arrangements as UK-approved data processors. We'll list specific regions here once confirmed with each provider — this is a placeholder to be filled in before publishing, not something to skip.

---

## 8. Your rights

Under UK GDPR, you have the right to:

- **Access** the personal data we hold about you (you can already see almost all of it directly in the app — your ledger, goals, reflections, and household records).
- **Rectify** anything that's inaccurate — most fields are editable in-app.
- **Erase** your data — deleting your account removes your personal data as described in Section 4. If you'd like this done manually or have questions about scope, contact us.
- **Restrict or object to** certain processing.
- **Data portability** — request an export of your data in a common format.
- **Withdraw consent** at any time for anything based on consent (Section 6), without affecting the lawfulness of processing before you withdrew it.
- **Complain to the ICO** — the UK's data protection regulator — if you think we've done something wrong. You can reach them at [ico.org.uk](https://ico.org.uk) or on 0303 123 1113. We'd genuinely rather you came to us first so we can put it right, but this is your right regardless.

To exercise any of these, contact **[contact email]**.

---

## 9. Changes to this notice

We'll update this notice as Storehouse changes — especially before real bank sync (Plaid) or any real money-movement feature goes live, both of which will substantially change what data we hold and why. We'll flag material changes clearly rather than silently editing this page.

---

## 10. Contact

Questions, concerns, or a rights request: **[contact email]**

If you're not satisfied with our response, you can complain to the Information Commissioner's Office at [ico.org.uk/make-a-complaint](https://ico.org.uk/make-a-complaint).

---

*This notice was last reviewed in draft form in July 2026. It has not yet been reviewed by a solicitor and must not be treated as final or legally sufficient until it has.*
