# The agency

This folder runs a digital agency for local businesses, trades first (plumbers, roofers, HVAC, electricians, painters). The agency finds where a business loses customers online, pitches the owner with proof, and builds the fix. Exported from Axel (lib/agency.ts and lib/agency-skills.ts); change it there and export again.

## The three steps
- **Find.** Scout scans the businesses in a trade and a town on a phone and ranks them by their biggest leak.
- **Pitch.** Sketch makes the proof: their first screen with the leak circled, and the fix in their brand. you drafts the email; the owner sends it from their own inbox.
- **Fix.** When the owner says yes, the specialist who owns that leak builds the fix, shows it, and puts it live only when told.

## The leak checklist
Checked on a phone, in this order. Every report uses these labels.

### Website
- **Number buried.** On a phone, is there a tap to call button on the first screen, before any scrolling? Fix: A call button top right that dials the business, on every page.
- **No way to book.** Can a visitor book or request a quote from the first screen, without hunting? Fix: A book or get a quote button beside the call button, going to a short form.
- **Rating hidden.** Does the Google rating and review count show on the first screen? Fix: The real rating and count by the button, pulled from the Google listing.
- **Nothing clear.** Does the first screen say what they do and where, in one line a stranger gets at once? Fix: A headline with the trade, the area and the promise, in plain words.
- **Ad says one thing.** When they run ads, does the page say what the ad promised (the offer, the service, the area)? Fix: A landing page per ad group that repeats the ad's offer word for word.
- **No reason today.** Is there a reason to call today: a time promise, a first visit offer, same day service? Fix: One concrete promise in the headline or a line under it.
- **First screen wasted.** What covers the first screen: a stock photo, a slider, a cookie wall, a menu? Or the number, the promise and the button? Fix: Cut what covers it. The first screen is the number, the promise, the rating and one button.
- **Slow to load.** Does the page draw in under 3 seconds on a phone connection? Does anything jump as it loads? Fix: Smaller images, no slider, no heavy scripts above the fold.

### Google listing
- **Reviews falling behind.** How many new reviews in the last 90 days, next to the two or three leaders in the same trade and town? Fix: A review request after every job, by text, with the direct review link.
- **No owner replies.** Does the owner reply to reviews, good and bad? When was the last reply? Fix: A reply to every review within a day, in the owner's voice.
- **Thin profile.** Are the services, hours, service area, photos, description and booking link filled in? Any photos newer than a year? Fix: Fill every field, add 10 recent job photos, set the booking link to the site's form.
- **Wrong details.** Do the phone, address and hours match the website? Fix: One set of details everywhere.

### Google Ads
- **No offer in the ad.** When they run search ads, does the ad make an offer, or only name the business? Fix: An offer in the headline: a price, a time promise, a discount with an end date.
- **Rival on their name.** Search the business's own name on a phone: does a competitor's ad appear above them? Fix: A small brand campaign on their own name, and a page that says it's them.
- **Ad to the homepage.** Does the ad land on a page about the thing the ad sells, or on the homepage? Fix: One landing page per service the ads sell.

### Follow up
- **Missed calls lost.** Call the number outside hours or when they're busy: is there a text back within a minute, or only voicemail? Fix: A missed call text back that answers at once and offers a booking link.
- **Forms go cold.** Send the site's form a test: does a reply come within an hour? Fix: An instant text and email back to every form, and the lead to the owner's phone.
- **No review ask.** After a job, does the customer get asked for a review, and how soon? Fix: A review request text the same evening, with the direct link.

## Who fixes what

| Leak | Agent |
|---|---|
| Number buried | mason |
| No way to book | mason |
| Rating hidden | mason |
| Nothing clear | mason |
| Ad says one thing | mason |
| No reason today | mason |
| First screen wasted | mason |
| Slow to load | mason |
| Reviews falling behind | stella |
| No owner replies | stella |
| Thin profile | maps |
| Wrong details | maps |
| No offer in the ad | penny |
| Rival on their name | penny |
| Ad to the homepage | penny |
| Missed calls lost | ringo |
| Forms go cold | ivy |
| No review ask | stella |

The agents are in .claude/agents/: **scout** (Leak Scanner), **mason** (Website Builder), **sketch** (Pitch Mockups), **ivy** (Intake Forms), **ringo** (Missed Call Text Back), **stella** (Review Requests), **maps** (Google Listing), **penny** (Ads Check). The main session (you, not a subagent) keeps the pitch: draft the email (subject under 8 words, three short paragraphs, the two mockup pictures attached, no promises) and the user sends it from their own inbox.

## Phone view
Read every page as a phone shows it, before any scroll. Use a browser tool: Claude in Chrome with the device toolbar at an iPhone size, or the Playwright MCP server started with `npx @playwright/mcp --device "iPhone 15"`. Load fresh, let it settle, screenshot the first screen. WebFetch alone misses what covers the first screen.

## Where things go
- audits/<business>/: the audit report (report.md) and its screenshots.
- mockups/<business>/: proof.png and fix.png for the pitch.
- sites/<business>/: a site, its form and its handler, under git.
- clients/<business>.md: a signed client's baseline, open leaks and what closed, with dates.

## Rules every agent keeps
- Never contact a business the agency hasn't signed: no emails, calls, texts or form submissions to a prospect. The user sends the pitch.
- Never invent a review, a rating, a number, a licence or a result, even in a mockup. Never promise a result: nobody can promise an owner will say yes or a phone will ring.
- Never ask for a password in the chat, and never commit a key: keys live in the environment.
- Nothing goes live (a site, a text rule, a listing change, an ad) until the owner says so, in their own words.
