import { AGENCY_TEAM, LEAK_CHECKLIST, PROCESS } from "@/lib/agency";
import { agencyTeam, hireSpecialist, hireTeam } from "@/lib/server/agency-team";
import { notReady } from "@/lib/server/ready";
import { fromBopsWindow } from "@/lib/server/ui-token";

export const dynamic = "force-dynamic";

/**
 * The agency's team (lib/agency.ts): GET lists the roster, the leak checklist and the three steps, with which
 * specialists this workspace has; POST hires one (`key`) or every one that's missing (no key). Hiring makes
 * bots, so it's the Bops window's alone (ui-token.ts), like a bot's settings.
 */
export async function GET(request: Request) {
  const unready = notReady();
  if (unready) return unready;
  const ws = new URL(request.url).searchParams.get("workspaceId") ?? undefined;
  const have = agencyTeam(ws);
  return Response.json({
    process: PROCESS,
    checklist: LEAK_CHECKLIST,
    team: AGENCY_TEAM.map((s) => {
      const b = have.get(s.key);
      return { key: s.key, name: s.name, role: s.role, owns: s.owns, skills: s.skills, ownComputer: s.ownComputer === true, ...(b ? { botId: b.id, botName: b.name } : {}) };
    }),
  });
}

export async function POST(request: Request) {
  const unready = notReady();
  if (unready) return unready;
  if (!fromBopsWindow(request)) return Response.json({ error: "The team can only be hired from the Bops app." }, { status: 403 });
  const { key, workspaceId } = (await request.json().catch(() => ({}))) as { key?: string; workspaceId?: string };
  if (key) {
    const r = await hireSpecialist(key, workspaceId);
    if ("error" in r) return Response.json(r, { status: 400 });
    return Response.json({ hired: [{ key, botId: r.bot.id, made: r.made, ...(r.note ? { note: r.note } : {}) }] });
  }
  const all = await hireTeam(workspaceId);
  return Response.json({
    hired: all.map(({ specialist, result }) => ("error" in result ? { key: specialist.key, error: result.error } : { key: specialist.key, botId: result.bot.id, made: result.made, ...(result.note ? { note: result.note } : {}) })),
  });
}
