import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const REPORT_TO = "contact.knevolution@gmail.com";
const REPORT_FROM = "RingPath <onboarding@resend.dev>";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, role, last_app_mode, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const count = profiles?.length ?? 0;
  const rows = (profiles ?? [])
    .map(
      (p) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${p.first_name} ${p.last_name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${p.role ?? "boxer"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${p.last_app_mode}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${formatDate(p.created_at)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;background:#070707;color:#f5f3ee;padding:24px;">
      <h2 style="margin:0 0 4px;">RingPath, rapport quotidien</h2>
      <p style="color:#7a7672;margin:0 0 20px;">${count} nouvelle${count > 1 ? "s" : ""} inscription${count > 1 ? "s" : ""} dans les dernières 24h.</p>
      ${
        count > 0
          ? `<table style="border-collapse:collapse;width:100%;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#7a7672;">Nom</th>
                  <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#7a7672;">Rôle</th>
                  <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#7a7672;">Mode</th>
                  <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#7a7672;">Créé le</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>`
          : `<p>Rien de nouveau aujourd'hui.</p>`
      }
    </div>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: REPORT_FROM,
      to: REPORT_TO,
      subject: `RingPath, ${count} nouvelle${count > 1 ? "s" : ""} inscription${count > 1 ? "s" : ""}`,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    return NextResponse.json({ error: "resend_failed", detail }, { status: 502 });
  }

  return NextResponse.json({ ok: true, count });
}
