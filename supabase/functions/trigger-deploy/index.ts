// Trigger the cPanel deploy GitHub Actions workflow_dispatch.
// Requires secrets: GITHUB_PAT (repo+workflow scope), GITHUB_REPO ("owner/repo"), optional GITHUB_WORKFLOW (defaults to cpanel-deploy.yml), optional GITHUB_REF (defaults to main).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    // Verify caller is an admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some((r) => r.role === "admin")) return json({ error: "forbidden" }, 403);

    const pat = Deno.env.get("GITHUB_PAT");
    const repoRaw = Deno.env.get("GITHUB_REPO") ?? "";
    // Normalize: strip https://github.com/, trailing .git, whitespace, trailing slash
    const repo = repoRaw
      .trim()
      .replace(/^https?:\/\/github\.com\//i, "")
      .replace(/\.git$/i, "")
      .replace(/\/$/, "");
    const workflow = (Deno.env.get("GITHUB_WORKFLOW") ?? "cpanel-deploy.yml").trim();
    const ref = (Deno.env.get("GITHUB_REF") ?? "main").trim();

    if (!pat || !repo) return json({ error: "Missing GITHUB_PAT or GITHUB_REPO secret" }, 500);
    if (!/^[^/]+\/[^/]+$/.test(repo)) {
      return json({ error: `GITHUB_REPO must be in 'owner/repo' format. Got: '${repo}'` }, 500);
    }

    const ghHeaders = {
      "Authorization": `Bearer ${pat}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "dreamcrest-admin",
    };

    // Pre-flight: can the PAT see the repo?
    const repoRes = await fetch(`https://api.github.com/repos/${repo}`, { headers: ghHeaders });
    if (!repoRes.ok) {
      const body = await repoRes.text();
      return json({
        error: `Cannot access repo '${repo}' (${repoRes.status}). Check GITHUB_REPO is exactly 'owner/repo' and PAT has 'repo' scope (or fine-grained access to this repo).`,
        github: body,
      }, 502);
    }

    // Pre-flight: does the workflow file exist?
    const wfRes = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}`, { headers: ghHeaders });
    if (!wfRes.ok) {
      const body = await wfRes.text();
      return json({
        error: `Workflow '${workflow}' not found in '${repo}' (${wfRes.status}). Make sure '.github/workflows/${workflow}' exists on the default branch and the PAT has 'workflow' scope.`,
        github: body,
      }, 502);
    }

    const ghRes = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`, {
      method: "POST",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ ref }),
    });


    if (!ghRes.ok) {
      const text = await ghRes.text();
      return json({ error: "GitHub API error", status: ghRes.status, body: text }, 502);
    }

    // Get most recent run for this workflow so the UI can show progress
    const runsRes = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs?per_page=1`, {
      headers: { "Authorization": `Bearer ${pat}`, "Accept": "application/vnd.github+json", "User-Agent": "dreamcrest-admin" },
    });
    const runsJson = runsRes.ok ? await runsRes.json() : null;

    return json({ ok: true, repo, workflow, ref, latestRunUrl: runsJson?.workflow_runs?.[0]?.html_url ?? `https://github.com/${repo}/actions` });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
