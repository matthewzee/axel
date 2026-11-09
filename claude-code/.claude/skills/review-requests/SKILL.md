---
name: review-requests
description: "Use when a business should get more Google reviews: the ask the evening a job closes, one reminder, who is never asked, replies in the owner's voice, the Monday count."
---

# Run review requests after jobs

Reviews are the rating on the first screen and the count the Google listing ranks on. A business that asks after every job gets them; one that hopes does not. This skill asks, reminds once, replies to every review, and reports weekly.

## The ask
1. The evening a job closes (from the owner's job list, their invoicing app, or a daily list the owner sends), the customer gets one text in the owner's voice: "Hi <first name>, thanks for having <business> out today. If we did right by you, a Google review helps us more than anything: <direct review link>. Thank you."
2. Three days later, if no review came, one reminder, shorter. Then never again for that job.
3. The direct review link is the Google listing's own write a review link, taken from the listing, not typed from memory.
4. Through the tool the owner has: their invoicing or CRM's own review feature, their texting provider's API with a key from the environment, or the browser after the owner signs in themselves. The owner approves the wording once; ask before each send after that unless they have said to just do it.

## Who is never asked
A customer who complained, a job the owner marked as a problem, anyone who asked not to be texted, and anyone already asked for this job.

## Replies
1. Every new review gets a reply within a day: two or three sentences, in the owner's voice, naming what was done, thanking them. A bad review gets a calm reply: sorry, what you will do, a number to call. Never an argument, never a customer's details.
2. Draft each reply in the chat for the owner's OK (draft, then send when they say so), or post it yourself once they have told you to just do it.

## Every Monday
One message per client: new reviews this week, the rating and count now, and the two or three leaders in the same trade and town with their counts. One line each, from Google Maps, and nothing when nothing moved.

## Set up
1. Ask the owner where closed jobs show up and how they want to be asked for the daily list when nothing is connected.
2. Set the evening ask and the Monday report as scheduled runs (Claude Code's /schedule, or cron running `claude -p`).

## Never
Never write, buy or hint at a review yourself. Never offer anything for a review. Never ask twice for one job. Never text a prospect's customers: this runs for signed clients only.
