import "server-only";
import { AGENCY_TEAM, specialistOf, type AgencySpecialist } from "@/lib/agency";
import { keptPersona, workspaceOf, type Bot } from "@/lib/types";
import { bot, getState, update } from "./store";
import { createBot } from "./bots";

/**
 * The agency's team on a workspace (lib/agency.ts AGENCY_TEAM): which specialists are there, and hiring the
 * ones that aren't. A specialist is matched by its name within the workspace (a renamed one is still the
 * same bot: Bot.agencyKey keeps the key), so one is never made twice. A new one gets its How I work from
 * the roster unless the owner already wrote one, so it works the way the roster says from its first turn.
 */

/** The specialists on a workspace's team, by key, with their bots. */
export function agencyTeam(workspaceId?: string): Map<string, Bot> {
  const ws = workspaceOf({ workspaceId: workspaceId ?? getState().workspace });
  const out = new Map<string, Bot>();
  for (const b of getState().bots) {
    if (workspaceOf(b) !== ws || b.isMain) continue;
    const key = b.agencyKey ?? specialistOf(b.name)?.key;
    if (key && !out.has(key)) out.set(key, b);
  }
  return out;
}

/**
 * Hire one specialist on a workspace: its bot, with the roster's role and How I work, on a computer of its own
 * when the roster says so and the plan has room. Already there: its bot, untouched. The owner's own How I work,
 * when they wrote one, stays.
 */
export async function hireSpecialist(key: string, workspaceId?: string): Promise<{ bot: Bot; made: boolean; note?: string } | { error: string }> {
  const s = specialistOf(key);
  if (!s) return { error: `no specialist named ${key}` };
  const ws = workspaceId ?? getState().workspace;
  const have = agencyTeam(ws).get(s.key);
  if (have) return { bot: have, made: false };
  const made = await createBot(s.name, s.role, ws, s.ownComputer === true);
  if ("error" in made) return made;
  const b = bot(made.botId);
  if (!b) return { error: "the bot wasn't kept" };
  update(() => {
    b.agencyKey = s.key;
    if (!b.persona) b.persona = keptPersona(s.persona);
  });
  return { bot: b, made: true, ...(made.note ? { note: made.note } : {}) };
}

/** Hire every specialist a workspace doesn't have yet. Each result in roster order. */
export async function hireTeam(workspaceId?: string): Promise<{ specialist: AgencySpecialist; result: Awaited<ReturnType<typeof hireSpecialist>> }[]> {
  const out: { specialist: AgencySpecialist; result: Awaited<ReturnType<typeof hireSpecialist>> }[] = [];
  for (const s of AGENCY_TEAM) out.push({ specialist: s, result: await hireSpecialist(s.key, workspaceId) });
  return out;
}

/** A bot's roster entry, when it's one of the agency's specialists (by its key, or its name when it was made before keys). */
export const specialistFor = (b: Pick<Bot, "name" | "agencyKey">): AgencySpecialist | undefined => (b.agencyKey ? specialistOf(b.agencyKey) : specialistOf(b.name));
