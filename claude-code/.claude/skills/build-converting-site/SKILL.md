---
name: build-converting-site
description: "Use when you build a site from scratch or rework one for a local business: what to gather, the pages, building it as an app, showing the first screen first, and done means."
---

# Build a converting site

A new site from scratch, or a rework of the one they have, for a local business. The site exists to make the phone ring: it passes the skill "The first screen that converts" (first-screen) on every page, and the rest is short and real.

## Gather what is real
1. From the owner, or their current site and Google listing: the business name, the trade, the towns served, the phone, the hours, the services with a line each, the licence or insurance line, and how long they have been at it.
2. The logo and the colors: from the current site, the Facebook page or the truck. No logo: the name set in a plain bold font, and the colors of their truck or uniform.
3. Ten real photos at most: finished jobs, the team, the truck. Ask for them when the site and the Facebook page have none worth using.
4. The Google rating and count, and three real reviews to quote, each with the reviewer's first name as it shows on Google.
5. One promise they will keep: same day, a time window, a first visit price, a guarantee. Ask the owner for it; never make one up.

## The pages
1. Home: the first screen, then the services as a short list with a button each, then three reviews, then the area served, then a short who we are, then the call and book buttons again.
2. One page per main service, each with its own first screen and the same form.
3. Reviews, with the real rating and a link to leave one.
4. Contact: the number, the form, the hours, the towns, a map.
5. A sticky call button on every page on phones.
Nothing else to start with. No blog, no gallery of forty photos, no about page longer than a paragraph.

## Build it
1. Build it as a plain static site in its own folder, sites/<business>/, under git: an index.html, a page per service, one stylesheet, images sized for phones. The form posts to the form the skill "Build a trades intake form" (trades-intake-form) sets up.
2. A rework keeps their domain, their pages' addresses (so Google's links keep working) and their real content, and changes the first screen, the buttons, the form and the speed first. Say what you kept.
3. Phone first, then the desktop. Check every page with the device toolbar before you show anything.
4. Show the first screen before you build the rest: run it locally (`npx serve sites/<business>` or `python3 -m http.server`), screenshot it in the phone view (CLAUDE.md, Phone view), and show that. Build on once the owner likes it.

## Facebook page
When all they have is a Facebook page, the skill "Turn a Facebook page into a website" (facebook-page-to-site) is the gather step; the rest is this skill.

## Done means
1. Every page passes the first screen check on a phone, and the call button dials.
2. A test lead went through the form and arrived (the form skill says how).
3. The site loads in under 3 seconds on a phone connection.
4. It is on a preview link for the owner to see (a preview deploy on the host the user uses: Netlify, Vercel or Cloudflare Pages). It goes live on their domain only when the owner says so, and you say what changes for them when it does.

## Never
Never invent a review, a rating, a licence, an award or a year. Never a stock photo on the first screen. Never put a site live without the owner's word, and never contact a prospect for what you need: ask the user.
