// Export the agency edition (lib/agency.ts, lib/agency-skills.ts) as a Claude Code kit: each skill a folder with
// a SKILL.md under .claude/skills/, each specialist a subagent under .claude/agents/, and a CLAUDE.md with the
// leak checklist and the rules every agent keeps. Bops' tools don't exist in Claude Code, so each line that names
// one is rewritten to what Claude Code has (REWRITES, exact lines), and the export stops if any Bops tool, place
// or word is left (LEFTOVERS). The skills stay the source: change lib/agency-skills.ts, then run this again.
//
// Usage: node scripts/export-claude-code.mjs [out folder, default claude-code]
import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const out = join(root, process.argv[2] ?? "claude-code");

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) specifier = pathToFileURL(`${root}/${specifier.slice(2)}`).href;
    try {
      return next(specifier, context);
    } catch (e) {
      if (/^(\.{1,2}\/|\/|file:)/.test(specifier))
        for (const ext of [".ts", ".tsx"])
          try {
            return next(specifier + ext, context);
          } catch {}
      throw e;
    }
  },
});

const { AGENCY_SKILLS } = await import(`${root}/lib/agency-skills.ts`);
const { AGENCY_TEAM, LEAK_CHECKLIST, PROCESS, fixerOf } = await import(`${root}/lib/agency.ts`);

/** How a page is read on a phone in Claude Code, said once in CLAUDE.md and pointed to from the skills. */
const PHONE_VIEW = "the phone view (CLAUDE.md, Phone view)";

/**
 * Each line of a Bops skill that names a Bops tool, and the line in Claude Code's words. Exact lines, so a change
 * to a skill that adds a Bops tool fails the export (LEFTOVERS) instead of shipping it.
 */
const REWRITES = new Map([
  [
    "1. You need a name and a town, or a website. With only a trade and a town, use business_search (local businesses) for the candidates, then audit each in turn, or the top five when there are many.",
    "1. You need a name and a town, or a website. With only a trade and a town, search Google Maps for the trade and the town in the browser (or WebSearch) for the candidates, then audit each in turn, or the top five when there are many.",
  ],
  [
    "3. Do it on a screen of your computer in a task (start_task): open Chrome, set the device toolbar to a phone (iPhone size), and read every page as a phone shows it. web_fetch alone misses what covers the first screen.",
    `3. Do it in a browser in ${PHONE_VIEW}, and read every page as a phone shows it. WebFetch alone misses what covers the first screen. Save each screenshot under audits/<business>/.`,
  ],
  [
    "2. Set the weekly scan with schedule: run task (it needs a phone view on a screen), quiet true, weekly on a morning the user picks, with a goal that names the client, their website, their Google listing and the baseline's leak labels, and says to follow this skill.",
    "2. Set the weekly scan as a scheduled run (Claude Code's /schedule, or cron running `claude -p`), weekly on a morning the user picks, with a prompt that names the client, their website, their Google listing and the baseline's file, and says to follow this skill and to say nothing when nothing changed.",
  ],
  [
    "3. For the ads and the listing a web page can show without signing in, add a watch (where web) on the search results for the business's name, looking for a competitor's ad above them or a review count that stopped moving. It reads every few hours with no screen.",
    "3. For the ads and the listing, the same scheduled run can search the business's name daily, looking for a competitor's ad above them or a review count that stopped moving, and stay quiet otherwise.",
  ],
  [
    "4. Something opened: one message. The leak's label, what changed and where, the proof (a screenshot of the first screen when it is the site), and which teammate fixes it. Then hand that fix to them with hand_off, with everything they need in the goal, when the user has said the team may fix leaks as they open; otherwise ask the user first.",
    "4. Something opened: one message. The leak's label, what changed and where, the proof (a screenshot of the first screen when it is the site), and which agent fixes it (CLAUDE.md, Who fixes what). Then hand that fix to that subagent, with everything it needs in the prompt, when the user has said leaks may be fixed as they open; otherwise ask the user first.",
  ],
  [
    "1. In a workspace with apps, build it as an app of the workspace (the skill \"Work on an app with Ingot\"), as a plain site when it needs no server: an index.html, a page per service, one stylesheet, images sized for phones. The form posts to the form the skill \"Build a trades intake form\" sets up.",
    "1. Build it as a plain static site in its own folder, sites/<business>/, under git: an index.html, a page per service, one stylesheet, images sized for phones. The form posts to the form the skill \"Build a trades intake form\" sets up.",
  ],
  [
    "4. Show the first screen before you build the rest, with make_image for a quick picture or the page itself at its Local or Preview. Build on once the owner likes it.",
    `4. Show the first screen before you build the rest: run it locally (\`npx serve sites/<business>\` or \`python3 -m http.server\`), screenshot it in ${PHONE_VIEW}, and show that. Build on once the owner likes it.`,
  ],
  [
    "4. It is on its Preview for the owner to see. It goes live on their domain only when the owner says so (the skill \"Deploy an app\"), and you say what changes for them when it does.",
    "4. It is on a preview link for the owner to see (a preview deploy on the host the user uses: Netlify, Vercel or Cloudflare Pages). It goes live on their domain only when the owner says so, and you say what changes for them when it does.",
  ],
  [
    "Say the leaks you saw, never ones you guess. A leak you could not check is Not checked, with why. No fixes here: the fix is the specialist's, and the main bot hands it on.",
    "Say the leaks you saw, never ones you guess. A leak you could not check is Not checked, with why. No fixes here: the fix belongs to the agent that owns the leak (CLAUDE.md, Who fixes what).",
  ],
  [
    "2. Never change the client's site, listing or ads from a scan: a scan reads. The fix is a teammate's job and waits for the user's word.",
    "2. Never change the client's site, listing or ads from a scan: a scan reads. The fix is another agent's job and waits for the user's word.",
  ],
  [
    "3. Nothing else: no advice, no price. The main bot writes the pitch.",
    "3. Nothing else: no advice, no price. The pitch email is written separately (CLAUDE.md, Who fixes what).",
  ],
  [
    "1. Open the page in a task on a screen (start_task): Facebook draws itself with scripts, and some of it needs scrolling. Never sign in as the business, and never message the page.",
    "1. Open the page in the browser (not WebFetch): Facebook draws itself with scripts, and some of it needs scrolling. Never sign in as the business, and never message the page.",
  ],
  [
    "Before the full build, show the owner the first screen next to their Facebook page's top on a phone, so they see the difference. make_image draws it from the first screen rule, in their colors and with their real rating.",
    `Before the full build, show the owner the first screen next to their Facebook page's top on a phone, so they see the difference: build the first screen as one HTML page from the first screen rule, in their colors and with their real rating, and screenshot both in ${PHONE_VIEW}.`,
  ],
  [
    "1. In a task on a screen (start_task), open their homepage in Chrome with the device toolbar at an iPhone size, and let it settle. Take the first screen exactly as it is: the cookie wall, the slider, whatever covers it.",
    `1. Open their homepage in ${PHONE_VIEW}, and let it settle. Take the first screen exactly as it is: the cookie wall, the slider, whatever covers it.`,
  ],
  [
    "4. Draw it with make_image from a description that names every element and its place, or build it as one HTML page at a phone width and screenshot it. The second is more exact; use it when the logo and the rating must be exact.",
    `4. Build it as one HTML page at a phone width (390 pixels), with their logo file and real details, and screenshot it in ${PHONE_VIEW}. Save it beside the proof as mockups/<business>/fix.png.`,
  ],
  [
    "3. The owner gets the lead at once by text and email: the five answers and the photo, in five lines. When the workspace has the business's tools connected, use_app puts the lead in their CRM or sheet too.",
    "3. The owner gets the lead at once by text and email: the five answers and the photo, in five lines. When the business has a CRM or sheet with an API, the handler puts the lead there too, with a key from the environment.",
  ],
  [
    "1. On the business's own number, so customers see the number they called. Ask the owner which phone system or number provider they use; most can forward a missed call or expose a webhook. When the workspace has it connected, use_app sets the rule; with an API key in the vault, call_api does. Otherwise do it in a task on a screen, signed in as the owner with a login from the Vault, never with a password in the chat.",
    "1. On the business's own number, so customers see the number they called. Ask the owner which phone system or number provider they use; most can forward a missed call or expose a webhook. With the provider's MCP server or API (a key in the environment, never in a file you commit), set the rule there. Otherwise walk the owner through it in their provider's settings, or work in the browser after they sign in themselves; never ask for a password in the chat.",
  ],
  [
    "A watch or a weekly check that the rule is still on, quiet unless it stopped. A text back that silently died is the leak you were hired to fix.",
    "A weekly scheduled check that the rule is still on, quiet unless it stopped. A text back that silently died is the leak you were hired to fix.",
  ],
  [
    "4. Through the tool the owner has: use_app when their invoicing or CRM is connected, call_api with a vault key for their texting provider, or a task on a screen signed in as the owner. The owner approves the wording once, and every send after that follows the bot's Approvals setting.",
    "4. Through the tool the owner has: their invoicing or CRM's own review feature, their texting provider's API with a key from the environment, or the browser after the owner signs in themselves. The owner approves the wording once; ask before each send after that unless they have said to just do it.",
  ],
  [
    "2. Set the evening ask and the Monday report with schedule (run chat when their tools are connected, task when it needs a screen).",
    "2. Set the evening ask and the Monday report as scheduled runs (Claude Code's /schedule, or cron running `claude -p`).",
  ],
  [
    "The owner's Google account manages the profile. Work in a task on a screen with a saved login from the Vault, never with a password in the chat, and change one section at a time. Every change waits for the owner's OK on the wording unless they have told you to just do it. When the owner has not given access, write every change out for them to paste, in order.",
    "The owner's Google account manages the profile. Work in the browser after the owner signs in themselves (or adds you as a manager), never with a password in the chat, and change one section at a time. Every change waits for the owner's OK on the wording unless they have told you to just do it. When the owner has not given access, write every change out for them to paste, in order.",
  ],
  [
    "1. On a phone view in a task (start_task), search the trade and the town. Read the ads: is theirs there, and does it make an offer (a price, a time promise, a discount with an end date), or only name them? Score No offer in the ad.",
    `1. In ${PHONE_VIEW}, search the trade and the town. Read the ads: is theirs there, and does it make an offer (a price, a time promise, a discount with an end date), or only name them? Score No offer in the ad.`,
  ],
  [
    "Only when the owner has said so, in a task on a screen with a login from the Vault, or through use_app when their ads account is connected. Read first: search terms, which ads get calls, what the landing pages are. Change one thing at a time, pause nothing without saying what it was doing, and never raise a budget. Every change waits for the owner's OK unless they have told you to just do it.",
    "Only when the owner has said so, in the browser after they sign in themselves (or add you to the account), or through the Google Ads API with keys from the environment. Read first: search terms, which ads get calls, what the landing pages are. Change one thing at a time, pause nothing without saying what it was doing, and never raise a budget. Every change waits for the owner's OK unless they have told you to just do it.",
  ],
]);

/** Descriptions that name a Bops tool, in Claude Code's words. */
const DESCRIPTIONS = new Map([
  [
    "Read when a signed client should be watched over time: the baseline audit, the weekly quiet scan, a watch on their search results, what a run says, and the Monday line.",
    "Use when a signed client should be watched over time: the baseline audit, the weekly quiet scan, a daily check of their search results, what a run says, and the Monday line.",
  ],
]);

/** Bops' tools, places and words; none may be left in what's exported. */
const LEFTOVERS = /\b(start_task|schedule:|hand_off|business_search|make_image|use_app|call_api|work_on_app|deploy_app|web_fetch|read_skill|Vault|vault|Ingot|Bops|Orgo|bops-local|its Local|its Preview|Approvals setting|a task on a screen|watch \(where|main bot|teammate)\b/;

/** A Claude Code skill's name: lowercase letters, digits and hyphens, at most 64. */
const slugOf = (s) => s.slug.replace(/^bops-/, "");

/** "the skill \"Build a trades intake form\"" with its Claude Code name after it, so the reference finds the folder. */
const pointed = (line) =>
  line.replace(/the skill "([^"]+)"/g, (whole, name) => {
    const k = AGENCY_SKILLS.find((x) => x.name === name);
    assert.ok(k, `a reference to a skill the kit doesn't have: ${name}`);
    return `the skill "${name}" (${slugOf(k)})`;
  });

const skillMd = (s) => {
  const lines = s.body.split("\n").map((line) => pointed(REWRITES.get(line) ?? line));
  const body = lines.join("\n");
  const description = (DESCRIPTIONS.get(s.description) ?? s.description).replace(/^Read (before|when)/, (_, w) => `Use ${w}`);
  return [`---`, `name: ${slugOf(s)}`, `description: ${JSON.stringify(description)}`, `---`, ``, body, ``].join("\n");
};

/** A specialist as a subagent: its How I work, the skills it uses (by their Claude Code names), and the rules. */
const agentMd = (sp) => {
  const skills = sp.skills.map((name) => AGENCY_SKILLS.find((k) => k.name === name)).map((k) => `- ${slugOf(k)}: ${k.name}`);
  const description = `${sp.role} for the agency. ${sp.owns} Use it for that work.`;
  return [
    `---`,
    `name: ${sp.key}`,
    `description: ${JSON.stringify(description)}`,
    `---`,
    ``,
    `You are ${sp.name}, the agency's ${sp.role}.`,
    ``,
    // Its How I work, with Axel's team words as Claude Code's: the other specialists are agents here.
    sp.persona.replace(/\bteammates?\b/g, (w) => (w.endsWith("s") ? "agents" : "agent")).replace(/\bthe main bot\b/g, "the main session"),
    ``,
    `Before you start, read CLAUDE.md (the leak checklist, the phone view and the rules), then the skill that fits:`,
    ...skills,
    ``,
    `Report back in a few plain lines: what you found or built, the proof (file paths of screenshots), and what waits on the user.`,
    ``,
  ].join("\n");
};

/** Which agent fixes each leak, as Axel's main bot hands it on (lib/agency.ts fixerOf). */
const fixerKey = (label) => fixerOf(label).key;

const claudeMd = () =>
  [
    `# The agency`,
    ``,
    `This folder runs a digital agency for local businesses, trades first (plumbers, roofers, HVAC, electricians, painters). The agency finds where a business loses customers online, pitches the owner with proof, and builds the fix. Exported from Axel (lib/agency.ts and lib/agency-skills.ts); change it there and export again.`,
    ``,
    `## The three steps`,
    ...PROCESS.map((p) => `- **${p.step}.** ${p.line.replace(/the main bot/gi, "you")}`),
    ``,
    `## The leak checklist`,
    `Checked on a phone, in this order. Every report uses these labels.`,
    ``,
    ...LEAK_CHECKLIST.flatMap((p) => [`### ${p.pillar}`, ...p.leaks.map((l) => `- **${l.label}.** ${l.check} Fix: ${l.fix}`), ``]),
    `## Who fixes what`,
    ``,
    `| Leak | Agent |`,
    `|---|---|`,
    ...LEAK_CHECKLIST.flatMap((p) => p.leaks.map((l) => `| ${l.label} | ${fixerKey(l.label)} |`)),
    ``,
    `The agents are in .claude/agents/: ${AGENCY_TEAM.map((s) => `**${s.key}** (${s.role})`).join(", ")}. The main session (you, not a subagent) keeps the pitch: draft the email (subject under 8 words, three short paragraphs, the two mockup pictures attached, no promises) and the user sends it from their own inbox.`,
    ``,
    `## Phone view`,
    `Read every page as a phone shows it, before any scroll. Use a browser tool: Claude in Chrome with the device toolbar at an iPhone size, or the Playwright MCP server started with \`npx @playwright/mcp --device "iPhone 15"\`. Load fresh, let it settle, screenshot the first screen. WebFetch alone misses what covers the first screen.`,
    ``,
    `## Where things go`,
    `- audits/<business>/: the audit report (report.md) and its screenshots.`,
    `- mockups/<business>/: proof.png and fix.png for the pitch.`,
    `- sites/<business>/: a site, its form and its handler, under git.`,
    `- clients/<business>.md: a signed client's baseline, open leaks and what closed, with dates.`,
    ``,
    `## Rules every agent keeps`,
    `- Never contact a business the agency hasn't signed: no emails, calls, texts or form submissions to a prospect. The user sends the pitch.`,
    `- Never invent a review, a rating, a number, a licence or a result, even in a mockup. Never promise a result: nobody can promise an owner will say yes or a phone will ring.`,
    `- Never ask for a password in the chat, and never commit a key: keys live in the environment.`,
    `- Nothing goes live (a site, a text rule, a listing change, an ad) until the owner says so, in their own words.`,
    ``,
  ].join("\n");

const readme = () =>
  [
    `# Axel agency kit for Claude Code`,
    ``,
    `The Axel agency team as Claude Code skills and subagents: ${AGENCY_SKILLS.length} skills, ${AGENCY_TEAM.length} agents, and a CLAUDE.md with the leak checklist and the rules.`,
    ``,
    `## Install`,
    `Copy \`.claude/\` and \`CLAUDE.md\` into the folder you'll run the agency from (or copy \`.claude/skills/*\` into \`~/.claude/skills/\` and \`.claude/agents/*\` into \`~/.claude/agents/\` to have them everywhere). Then start \`claude\` in that folder.`,
    ``,
    `For the phone view, add a browser: Claude in Chrome, or \`claude mcp add playwright -- npx @playwright/mcp@latest --device "iPhone 15"\`.`,
    ``,
    `## Try it`,
    `- "Use scout to audit plumbers in Edwardsville, IL for lead leaks."`,
    `- "Have sketch make the pitch mockup for Smith Plumbing from the audit."`,
    `- "Draft the pitch email for Smith Plumbing."`,
    `- "Smith Plumbing signed. Have mason rebuild their first screen, and ivy build the intake form."`,
    ``,
    `## Skills`,
    ...AGENCY_SKILLS.map((s) => `- \`${slugOf(s)}\`: ${s.name}`),
    ``,
    `## Agents`,
    ...AGENCY_TEAM.map((s) => `- \`${s.key}\` (${s.name}, ${s.role}): ${s.owns}`),
    ``,
    `## What's different from Axel`,
    `No cloud computers, saved logins, connected apps or phone number: the agents work in your browser and your terminal, and keys come from your environment. Scheduled scans run with Claude Code's /schedule or cron with \`claude -p\`. Mockups are HTML pages screenshotted at a phone width instead of drawn pictures.`,
    ``,
    `Regenerate from Axel with \`node scripts/export-claude-code.mjs\`.`,
    ``,
  ].join("\n");

// Write it, checking as it goes: every rewrite used, nothing of Bops left, names as Claude Code takes them.
const used = new Set();
for (const s of AGENCY_SKILLS) for (const line of s.body.split("\n")) if (REWRITES.has(line)) used.add(line);
for (const line of REWRITES.keys()) assert.ok(used.has(line), `a rewrite no skill has any more: ${line.slice(0, 80)}`);

rmSync(out, { recursive: true, force: true });
const files = [];
const write = (path, content) => {
  const where = join(out, path);
  mkdirSync(join(where, ".."), { recursive: true });
  const m = LEFTOVERS.exec(content);
  assert.ok(!m, `${path}: "${m?.[0]}" is Bops', not Claude Code's (${content.split("\n").find((l) => m && l.includes(m[0]))?.slice(0, 120)})`);
  writeFileSync(where, content);
  files.push(path);
};

for (const s of AGENCY_SKILLS) {
  assert.match(slugOf(s), /^[a-z0-9]+(-[a-z0-9]+)*$/);
  assert.ok(slugOf(s).length <= 64);
  write(`.claude/skills/${slugOf(s)}/SKILL.md`, skillMd(s));
}
for (const sp of AGENCY_TEAM) write(`.claude/agents/${sp.key}.md`, agentMd(sp));
write("CLAUDE.md", claudeMd());
write("README.md", readme());

console.log(`Exported ${AGENCY_SKILLS.length} skills and ${AGENCY_TEAM.length} agents to ${out}:\n${files.map((f) => `  ${f}`).join("\n")}`);
