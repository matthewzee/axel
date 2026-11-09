// Tests for the agency edition (lib/agency.ts): the roster (keys and names unique, roles as Bot.role takes
// them, each How I work under MAX_PERSONA_CHARS and in plain words, each skill it leans on real), the leak
// checklist (labels unique, every label with a check and a fix, in the order to check), which specialist a leak
// goes to, and the prompt lines (aboutAgency and teamLine: the contact rule, the three steps, no dashes as
// punctuation, every specialist named, the ones to hire listed).
//
// Pure: nothing is written, started or called.
// Usage: node scripts/test-agency.mjs
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

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

const { AGENCY_TEAM, LEAK_CHECKLIST, LEAK_LABELS, PROCESS, aboutAgency, fixerOf, specialistOf, teamLine } = await import(`${root}/lib/agency.ts`);
const { AGENCY_SKILLS } = await import(`${root}/lib/agency-skills.ts`);
const { LEAKS_LABEL } = await import(`${root}/lib/skill-labels.ts`);

/** As lib/types.ts MAX_PERSONA_CHARS (types.ts pulls in the window's modules, so the number is here). */
const MAX_PERSONA_CHARS = 1500;

let failures = 0;
let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failures++;
    console.error(`FAIL ${name}\n  ${e.message.split("\n").join("\n  ")}`);
  }
}

const noDashes = (where, text) => {
  for (const m of text.matchAll(/[–—]|\s-{1,2}\s|^\s*[-*] /gm)) assert.fail(`${where}: a dash at ${m.index}`);
};

check("The roster: eight specialists, keys and names unique, roles one to three words, each with a line on what it owns", () => {
  assert.equal(AGENCY_TEAM.length, 8);
  const keys = new Set();
  const names = new Set();
  for (const s of AGENCY_TEAM) {
    assert.match(s.key, /^[a-z]+$/, s.key);
    assert.ok(!keys.has(s.key), `${s.key} twice`);
    keys.add(s.key);
    assert.ok(!names.has(s.name.toLowerCase()), `${s.name} twice`);
    names.add(s.name.toLowerCase());
    assert.ok(s.name.length <= 40, `${s.name}: as long as a bot's name may be`);
    assert.ok(s.role.split(" ").length <= 4 && s.role.length <= 40, `${s.role}: a short role`);
    assert.ok(s.owns.includes(":") && s.owns.length < 220, `${s.key}: owns, with a colon after the few words the Team line uses`);
    assert.ok(specialistOf(s.key) === s && specialistOf(s.name.toUpperCase()) === s, `${s.key} found by key and by name`);
  }
  assert.equal(specialistOf("nobody"), undefined);
});

check("Each How I work fits Bot.persona, is in plain words, and never promises a result", () => {
  for (const s of AGENCY_TEAM) {
    assert.ok(s.persona.length > 200 && s.persona.length <= MAX_PERSONA_CHARS, `${s.key}: ${s.persona.length} characters`);
    assert.equal(s.persona, s.persona.trim());
    noDashes(`${s.key} persona`, s.persona);
    assert.ok(!/\bguarantee(d)?\b(?! line)/i.test(s.persona) || /never/.test(s.persona), `${s.key}: no guarantee`);
    for (const skill of s.skills) assert.ok(AGENCY_SKILLS.some((k) => k.name === skill), `${s.key} leans on "${skill}", which isn't an agency skill`);
    assert.ok(s.skills.length >= 1 && s.skills.length <= 3, `${s.key}: one to three skills`);
    if (s.firstTask) assert.ok(s.firstTask.title.length <= 40 && s.firstTask.goal.length > 60, `${s.key}: a first task with a short title and a full goal`);
  }
  // Only the site builder wants a computer of its own (its logins and long builds).
  assert.deepEqual(
    AGENCY_TEAM.filter((s) => s.ownComputer).map((s) => s.key),
    ["mason"],
  );
});

check("The checklist: four pillars in the order to check, every label unique with a check and a fix, and the audit skill scores every label", () => {
  assert.deepEqual(
    LEAK_CHECKLIST.map((p) => p.pillar),
    ["Website", "Google listing", "Google Ads", "Follow up"],
  );
  assert.equal(new Set(LEAK_LABELS.map((l) => l.toLowerCase())).size, LEAK_LABELS.length);
  assert.ok(LEAK_LABELS.length >= 15);
  for (const p of LEAK_CHECKLIST)
    for (const l of p.leaks) {
      assert.ok(l.label.length <= 24 && /^[A-Z]/.test(l.label), `${l.label}: a short label, a capital first`);
      assert.ok(l.check.endsWith("?"), `${l.label}: the check is a question`);
      assert.ok(l.fix.length > 20, `${l.label}: a fix`);
      noDashes(l.label, `${l.check} ${l.fix}`);
    }
  const audit = AGENCY_SKILLS.find((s) => s.slug === "bops-lead-leak-audit").body;
  for (const label of LEAK_LABELS) assert.ok(audit.includes(label), `the audit scores "${label}"`);
});

check("Every leak goes to the specialist who owns it", () => {
  const to = (label) => fixerOf(label)?.key;
  assert.equal(to("Missed calls lost"), "ringo");
  assert.equal(to("Forms go cold"), "ivy");
  assert.equal(to("Reviews falling behind"), "stella");
  assert.equal(to("No owner replies"), "stella");
  assert.equal(to("No review ask"), "stella");
  assert.equal(to("Thin profile"), "maps");
  assert.equal(to("Wrong details"), "maps");
  assert.equal(to("No offer in the ad"), "penny");
  assert.equal(to("Rival on their name"), "penny");
  assert.equal(to("Ad to the homepage"), "penny");
  for (const label of ["Number buried", "No way to book", "Rating hidden", "Nothing clear", "Ad says one thing", "No reason today", "First screen wasted", "Slow to load"]) assert.equal(to(label), "mason", label);
  for (const label of LEAK_LABELS) assert.ok(fixerOf(label), `${label} has a fixer`);
});

check("The three steps are Find, Pitch and Fix, and the user sends the pitch", () => {
  assert.deepEqual(
    PROCESS.map((p) => p.step),
    ["Find", "Pitch", "Fix"],
  );
  assert.match(PROCESS[1].line, /owner sends it from their own inbox/);
  assert.match(PROCESS[2].line, /puts it live only when told/);
});

check("aboutAgency: whom the team serves, every pillar's labels, the three steps, the skills' label, the contact rule, no promises, no dashes", () => {
  const text = aboutAgency();
  assert.ok(text.length < 2500, `${text.length} characters`);
  assert.match(text, /digital agency for local businesses, trades first/);
  for (const p of LEAK_CHECKLIST) assert.ok(text.includes(`${p.pillar}:`), p.pillar);
  for (const label of LEAK_LABELS) assert.ok(text.includes(label.toLowerCase()), label);
  assert.match(text, /Find \(.*\), Pitch \(.*\) and Fix \(/);
  assert.ok(text.includes(`"${LEAKS_LABEL}"`));
  assert.match(text, /Never contact a business the agency hasn't signed/);
  assert.match(text, /never promise a result/);
  noDashes("aboutAgency", text);
});

check("teamLine: every specialist named with its role, the ones to hire listed by exact name, own_computer only for Mason, and the whole team said when it's there", () => {
  const none = teamLine(new Set());
  for (const s of AGENCY_TEAM) assert.ok(none.includes(`${s.name} (${s.role}:`), s.name);
  assert.match(none, /Not on the team yet: Scout, Mason, Sketch, Ivy, Ringo, Stella, Maps, Penny\./);
  assert.match(none, /create_bot, with exactly its name and role above, and own_computer for Mason/);
  assert.match(none, /You keep the pitch/);
  noDashes("teamLine", none);
  const some = teamLine(new Set(["scout", "mason", "sketch"]));
  assert.match(some, /Not on the team yet: Ivy, Ringo, Stella, Maps, Penny\./);
  assert.ok(!some.includes("own_computer"), "Mason is there, so no own_computer");
  const all = teamLine(new Set(AGENCY_TEAM.map((s) => s.key)));
  assert.match(all, /The whole team is here/);
  assert.ok(!all.includes("Not on the team yet"));
});

console.log(`agency: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
