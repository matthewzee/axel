---
name: missed-call-text-back
description: "Use when a business misses calls: the text within a minute in the owner's voice, the alert, setting it up on their own number, the wording the owner approves, the test."
---

# Set up a missed call text back

A trades business misses calls all day: on a roof, under a sink, driving. The caller calls the next number. A missed call text back answers in under a minute, in the owner's voice, keeps the lead and tells the owner.

## What it does
1. A call to the business's number goes unanswered or to voicemail.
2. Within a minute, the caller gets one text: "Hi, this is <business>. Sorry we missed you. Reply here with what you need, or book a time: <booking link>. We will call you back by <the promise>."
3. The owner gets a text and an email with the caller's number and the time.
4. The caller's reply goes to the owner, and the owner answers from their own phone. The bot never pretends to be a person on the line.

## Set it up
1. On the business's own number, so customers see the number they called. Ask the owner which phone system or number provider they use; most can forward a missed call or expose a webhook. With the provider's MCP server or API (a key in the environment, never in a file you commit), set the rule there. Otherwise walk the owner through it in their provider's settings, or work in the browser after they sign in themselves; never ask for a password in the chat.
2. No provider that can do it: propose a text back number that forwards to theirs, and say the trade off (a second number) plainly. The owner decides.
3. The booking link is the site's form (the skill "Build a trades intake form" (trades-intake-form)), with the source set to missed call so the owner sees where leads come from.
4. Write every message word for word and show them to the owner before anything goes live. Short, plain, their name, no emoji unless the owner uses them. The owner approves each.
5. Business hours and after hours get different texts: after hours says when they open.
6. A caller who texts STOP is never texted again. Say so in the first text's wording when the provider needs it.

## Test it
Call the number from a test phone and let it ring out. Show the owner the text that came back and the alert they got, with the times. Not done until the text arrived in under a minute.

## Keep it working
A weekly scheduled check that the rule is still on, quiet unless it stopped. A text back that silently died is the leak you were hired to fix.

## Never
Never text anyone who did not call the business. Never set this up on a prospect's number. Never answer as a person, give prices, or book a job yourself in the texts.
