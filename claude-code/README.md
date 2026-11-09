# Axel agency kit for Claude Code

The Axel agency team as Claude Code skills and subagents: 11 skills, 8 agents, and a CLAUDE.md with the leak checklist and the rules.

## Install
Copy `.claude/` and `CLAUDE.md` into the folder you'll run the agency from (or copy `.claude/skills/*` into `~/.claude/skills/` and `.claude/agents/*` into `~/.claude/agents/` to have them everywhere). Then start `claude` in that folder.

For the phone view, add a browser: Claude in Chrome, or `claude mcp add playwright -- npx @playwright/mcp@latest --device "iPhone 15"`.

## Try it
- "Use scout to audit plumbers in Edwardsville, IL for lead leaks."
- "Have sketch make the pitch mockup for Smith Plumbing from the audit."
- "Draft the pitch email for Smith Plumbing."
- "Smith Plumbing signed. Have mason rebuild their first screen, and ivy build the intake form."

## Skills
- `lead-leak-audit`: Audit a local business's lead funnel
- `leak-scan`: Keep scanning a client's funnel
- `first-screen`: The first screen that converts
- `build-converting-site`: Build a converting site
- `facebook-page-to-site`: Turn a Facebook page into a website
- `pitch-mockup`: Make a pitch mockup
- `trades-intake-form`: Build a trades intake form
- `missed-call-text-back`: Set up a missed call text back
- `review-requests`: Run review requests after jobs
- `google-listing-fix`: Fix a Google Business Profile
- `google-ads-check`: Check the Google Ads leaks

## Agents
- `scout` (Scout, Leak Scanner): Finds the leaks: scans a business's funnel on a phone, scores every leak, and keeps scanning the clients' funnels so a new leak is caught the week it opens.
- `mason` (Mason, Website Builder): Builds converting websites: new ones from scratch, reworks of an existing site, and a real website out of a business's Facebook page.
- `sketch` (Sketch, Pitch Mockups): Makes the proof for a pitch: the business's first screen on a phone with the problem circled, and a corrected first screen in their brand, ready to show.
- `ivy` (Ivy, Intake Forms): Builds the intake form a trades business captures leads with: short, on a phone, asking only what the office needs to quote, with the lead delivered at once.
- `ringo` (Ringo, Missed Call Text Back): Sets up the missed call text back: a missed call gets a text within a minute, with a booking link, and the owner gets the lead.
- `stella` (Stella, Review Requests): Runs the review engine: a review request after every job, replies to every review in the owner's voice, and a weekly count against the town's leaders.
- `maps` (Maps, Google Listing): Fixes the Google Business Profile: a full profile, recent photos, matching details, services and a booking link.
- `penny` (Penny, Ads Check): Checks the Google Ads leaks: an offer in every ad, a landing page per service, and nobody else's ad on the business's own name.

## What's different from Axel
No cloud computers, saved logins, connected apps or phone number: the agents work in your browser and your terminal, and keys come from your environment. Scheduled scans run with Claude Code's /schedule or cron with `claude -p`. Mockups are HTML pages screenshotted at a phone width instead of drawn pictures.

Regenerate from Axel with `node scripts/export-claude-code.mjs`.
