// Generates AI-powered insights using Lovable AI Gateway (Gemini Flash, free).
// Modes:
//   { mode: "daily" }                — last 24 h summary, upserts into daily_insights.
//   { mode: "search_clusters" }      — clusters recent search queries.
//   { mode: "review_sentiment", review_ids?: string[] } — classifies sentiment for reviews missing it.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI gateway error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? "";
}

function topCounts<T extends string>(arr: T[], limit = 10): [string, number][] {
  const m: Record<string, number> = {};
  for (const k of arr) m[k] = (m[k] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const body = await req.json().catch(() => ({}));
    const mode = body.mode ?? "daily";

    if (mode === "daily") {
      const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const [{ data: events }, { data: searches }, { data: errors }] = await Promise.all([
        supa.from("site_analytics").select("event_type, page_path, metadata, country, city, device_type, visitor_id, created_at")
          .gte("created_at", since).limit(20000),
        supa.from("site_analytics").select("metadata, page_path, visitor_id, created_at")
          .eq("event_type", "search_query").gte("created_at", since).limit(2000),
        supa.from("error_logs").select("message").gte("created_at", since).limit(200),
      ]);

      const totals: Record<string, number> = {};
      const topProducts: string[] = [];
      const topCategories: string[] = [];
      const topPages: string[] = [];
      const topCountries: string[] = [];
      const devices: string[] = [];
      const intentVisitors = new Set<string>();
      const viewVisitors = new Set<string>();
      for (const e of events ?? []) {
        totals[e.event_type] = (totals[e.event_type] || 0) + 1;
        if (e.event_type === "product_view" || e.event_type === "tool_view" || e.event_type === "whatsapp_click" || e.event_type === "tool_whatsapp_click" || e.event_type === "checkout_click" || e.event_type === "add_to_cart") {
          const md: any = e.metadata ?? {};
          if (md.name) topProducts.push(String(md.name).slice(0, 60));
          if (md.category) topCategories.push(String(md.category).slice(0, 40));
        }
        if (e.event_type === "product_view" || e.event_type === "tool_view") {
          if (e.visitor_id) viewVisitors.add(e.visitor_id);
        }
        if (e.event_type === "whatsapp_click" || e.event_type === "tool_whatsapp_click" || e.event_type === "checkout_click") {
          if (e.visitor_id) intentVisitors.add(e.visitor_id);
        }
        if (e.page_path) topPages.push(e.page_path);
        if (e.country) topCountries.push(e.country);
        if (e.device_type) devices.push(e.device_type);
      }

      // Searches that did NOT lead to intent from same visitor within 30 minutes
      const visitorIntentTimes: Record<string, number[]> = {};
      for (const e of events ?? []) {
        if (!e.visitor_id) continue;
        if (e.event_type === "whatsapp_click" || e.event_type === "tool_whatsapp_click" || e.event_type === "checkout_click") {
          (visitorIntentTimes[e.visitor_id] ||= []).push(new Date(e.created_at).getTime());
        }
      }
      const missedSearches: string[] = [];
      for (const s of (searches ?? []) as any[]) {
        const term = String(s.metadata?.q ?? s.metadata?.query ?? "").trim().toLowerCase();
        if (!term) continue;
        const ts = new Date(s.created_at).getTime();
        const intents = s.visitor_id ? visitorIntentTimes[s.visitor_id] || [] : [];
        const converted = intents.some(t => t > ts && t - ts < 30 * 60 * 1000);
        if (!converted) missedSearches.push(term);
      }

      const intentRate = viewVisitors.size ? Math.round((intentVisitors.size / viewVisitors.size) * 1000) / 10 : 0;

      const metrics = {
        totals,
        intent_rate_pct: intentRate,
        unique_view_visitors: viewVisitors.size,
        unique_intent_visitors: intentVisitors.size,
        top_products: topCounts(topProducts, 10),
        top_categories: topCounts(topCategories, 8),
        top_pages: topCounts(topPages, 10),
        top_countries: topCounts(topCountries, 8),
        device_split: topCounts(devices, 4),
        searched_but_not_converted: topCounts(missedSearches, 12),
        error_count: errors?.length ?? 0,
      };

      const prompt = `You are a senior growth analyst for an Indian premium-subscription store called Castle Tools.
Given the last 24 hours of raw metrics, produce a tight Markdown brief with EXACTLY these 4 sections:
1. **What users wanted today** — 3 bullets naming specific tools/categories and the numbers behind them.
2. **What blocked them** — 2 bullets (errors, low intent rate, drop-offs, missing inventory inferred from "searched_but_not_converted").
3. **Emerging demand & inventory gaps** — 2 bullets: rising products + searched-but-missing terms worth stocking.
4. **One recommended action for tomorrow** — 1 sentence, concrete.
Be specific, reference numbers, no fluff, no preamble.

METRICS_JSON:
${JSON.stringify(metrics).slice(0, 12000)}`;

      const summary = await callAI(
        "You write concise growth briefs. Output Markdown only. No emojis.",
        prompt,
      );

      const today = new Date().toISOString().slice(0, 10);
      await supa.from("daily_insights").upsert({ for_date: today, summary_md: summary, metrics }, { onConflict: "for_date" });

      return new Response(JSON.stringify({ ok: true, for_date: today, summary_md: summary, metrics }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (mode === "search_clusters") {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data } = await supa.from("site_analytics").select("metadata").eq("event_type", "search_query").gte("created_at", since).limit(2000);
      const terms = (data ?? []).map((r: any) => String(r.metadata?.q ?? r.metadata?.query ?? "").trim().toLowerCase()).filter(Boolean);
      if (terms.length === 0) return new Response(JSON.stringify({ ok: true, clusters: [] }), { headers: { ...cors, "Content-Type": "application/json" } });
      const counts = topCounts(terms, 200);
      const summary = await callAI(
        "You cluster e-commerce search queries. Output strict JSON only.",
        `Cluster these searches (term, count) into 6-10 thematic groups. For each cluster return {"theme": "...", "intent": "buy|info|missing", "examples": [...], "total": number, "note": "..."}.
Wrap as {"clusters": [...]}. Mark cluster intent="missing" if the searched term clearly maps to no product we likely sell.

DATA:
${JSON.stringify(counts)}`,
      );
      let clusters: unknown = [];
      try { clusters = JSON.parse(summary.replace(/^```json|```$/g, "").trim()).clusters; } catch { clusters = []; }
      return new Response(JSON.stringify({ ok: true, clusters }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (mode === "review_sentiment") {
      const ids: string[] | undefined = body.review_ids;
      let q = supa.from("product_reviews").select("id, rating, title, body").is("sentiment", null).limit(20);
      if (ids?.length) q = supa.from("product_reviews").select("id, rating, title, body").in("id", ids);
      const { data } = await q;
      const updated: string[] = [];
      for (const r of (data ?? []) as Array<{ id: string; rating: number; title: string | null; body: string }>) {
        const out = await callAI(
          "Classify e-commerce review sentiment. Output strict JSON only.",
          `Review (rating=${r.rating}/5):\nTitle: ${r.title ?? ""}\nBody: ${r.body}\n\nReturn {"sentiment":"positive|neutral|negative","summary":"<=80 chars"}`,
        );
        try {
          const parsed = JSON.parse(out.replace(/^```json|```$/g, "").trim());
          await supa.from("product_reviews").update({ sentiment: parsed.sentiment, sentiment_summary: String(parsed.summary).slice(0, 200) }).eq("id", r.id);
          updated.push(r.id);
        } catch { /* ignore parse error for this row */ }
      }
      return new Response(JSON.stringify({ ok: true, updated }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: false, error: "unknown mode" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String((e as Error).message ?? e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
