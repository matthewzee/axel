---
name: leak-scan
description: "Use when a signed client should be watched over time: the baseline audit, the weekly quiet scan, a daily check of their search results, what a run says, and the Monday line."
---

# Keep scanning a client's funnel

A signed client's funnel is scanned again every week, so a leak that opens is caught the week it opens: a site change that buried the number, a rival's ad on their name, reviews stalling, a text back that stopped.

## Set it up
1. Do a full audit first (the skill "Audit a local business's lead funnel" (lead-leak-audit)) and keep its report as the baseline: the leaks found, and what was fine.
2. Set the weekly scan as a scheduled run (Claude Code's /schedule, or cron running `claude -p`), weekly on a morning the user picks, with a prompt that names the client, their website, their Google listing and the baseline's file, and says to follow this skill and to say nothing when nothing changed.
3. For the ads and the listing, the same scheduled run can search the business's name daily, looking for a competitor's ad above them or a review count that stopped moving, and stay quiet otherwise.

## Each run
1. Repeat the audit's five steps on the phone view, quickly: first screen, the rest of the site, the listing, the ads, and for a client who asked for it, a missed call and a test form.
2. Compare with the baseline: a leak that opened, a leak that closed, a count that moved (reviews in the last 90 days, rating, review reply gap).
3. Nothing changed: say nothing. The run is quiet.
4. Something opened: one message. The leak's label, what changed and where, the proof (a screenshot of the first screen when it is the site), and which agent fixes it (CLAUDE.md, Who fixes what). Then hand that fix to that subagent, with everything it needs in the prompt, when the user has said leaks may be fixed as they open; otherwise ask the user first.
5. Something closed: one line, so the user can tell the client.
6. Update the baseline in the client's notes: what is open, what closed, the date.

## Every Monday
The user gets one line per client, only for clients where something moved: open leaks, closed leaks, and the review count against the town's leaders. Clients with nothing to say are not listed.

## Never
1. Never contact the client's customers or competitors.
2. Never change the client's site, listing or ads from a scan: a scan reads. The fix is another agent's job and waits for the user's word.
3. Never report a leak you did not see on this run.
