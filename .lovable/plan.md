# Wallet Whisperer — frontend overhaul (understanding + next steps)

## What the product is
Wallet Whisperer ("Can we afford it?") helps a person, and a group of people, decide whether they can afford a purchase.

1. **My Money**: checking, savings, credit cards, loans, transactions, savings goals, one list of bills, loans and subscriptions (each tagged essential or not), likely paychecks, a 30-day check and a 60-day cash-flow timeline. Every number shows where it came from and when it was last synced (live, stale or sample data).
2. **Financial health**: five green/yellow/red/"needs input" indicators: bills covered 40%, safety cushion 20%, debt load 15%, savings protection 15%, subscriptions 10%. A score out of 100 with an overall status. A red result on essential bills makes the whole result red.
3. **Can I buy this?**: name, amount, date, the exact account and an optional goal. The answer is "Yes", "Yes, if..." or "Not right now", with before and after indicators, the lowest balance and its date, and an explanation.
4. **Huddles**: group purchases. Pledging, yellow acknowledgement, reveal, agreeing, locked or cancelled. Each member's finances stay private and only the agreed amounts are revealed. Some members can join without paying.
5. **Mock funding**: progress shown as pledged, approved, pending and completed.
6. **Accounts**: sign up and log in, unique @usernames, friend and household requests by username that the other person accepts on their own device.
7. **AI agent activity (Nemotron)**: the tool calls are shown visibly. The calculation engine produces every number and the AI explains it.

Demo people: Alex (tight cash), Jordan (healthy), Maya (part-time income), Leo (not paying), Sam (private friend).

## Scope of our work
- Frontend and UI only: recreate the current screens, then redesign them to your visual direction.
- The existing backend (Nessie, MongoDB, Nemotron, the calculation engine) is not rebuilt here. Screens will use sample data that mirrors your data shapes (amounts in cents, an exact account on every decision, private and shared views), clearly labeled as sample data.
- Every screen needs loading, empty, incomplete-data, stale-data and error states.

## Next steps
1. You send screenshots of every page (My Money, purchase check, Huddles, friends, households, login and signup).
2. You share your design direction (colors, fonts, mood, reference sites).
3. I propose a page-by-page build plan for your approval, then build it.
