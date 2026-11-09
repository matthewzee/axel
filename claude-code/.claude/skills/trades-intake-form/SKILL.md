---
name: trades-intake-form
description: "Use when a site needs its lead form: five fields in the office's order, by trade, the instant reply, the lead to the owner's phone, building it and the test lead."
---

# Build a trades intake form

The form is how a visitor who will not call becomes a lead. Short, on a phone, in the order the office asks on the phone, and delivered at once to the owner with an instant reply to the customer. A form nobody answers is a leak.

## The fields
Five at most, in this order, big enough for a thumb:
1. What do you need? A list of their services as buttons, plus Other.
2. Where? Town or zip. A list of the towns served when there are few.
3. When? Today, this week, just planning.
4. Name.
5. Phone. Email optional, below it.
Photos optional at the end ("Add a photo of the problem"). Never a budget, never a long description box first, never an account.

## By trade
Plumber: the first field asks about the leak, the drain, the water heater, and which floor. Roofer: repair or replacement, the roof's age, storm damage. HVAC: no heat, no cool, maintenance, the unit's age. Electrician: outage, a panel, new wiring, an EV charger. Painter: inside or outside, rooms or the whole house. Use the trade's words, as the owner says them.

## What happens on submit
1. The customer sees one line: "Got it. Someone from <business> will text or call you within <the promise>." The promise is the owner's, never invented.
2. The customer gets a text saying the same, from the business's number when a missed call text back is set up (the skill "Set up a missed call text back" (missed-call-text-back)), else an email.
3. The owner gets the lead at once by text and email: the five answers and the photo, in five lines. When the business has a CRM or sheet with an API, the handler puts the lead there too, with a key from the environment.
4. The lead is kept somewhere the owner can see later: their sheet, their CRM, or the site's own list.

## Build it
1. On the site itself, as a page of the app (the skill "Build a converting site" (build-converting-site)): a plain HTML form posting to a small handler, or the form tool the owner already pays for when they have one.
2. Spam: a hidden field bots fill and a one second minimum. No captcha a thumb has to fight.
3. Every service page's button opens the same form with the service already picked.

## Test it
Send one test lead yourself with Test in the name, on the phone view, and show the owner what arrived: the text, the email, the row. Then delete the test lead. Not done until the test arrived.

## Never
Never send a test to a prospect's form. Never keep a customer's number anywhere the owner did not pick. Never promise a reply time the owner did not give.
