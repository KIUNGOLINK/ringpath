import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requested = searchParams.get("next") ?? "/app/spar";
  // Only allow same-site relative paths, never an open redirect.
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/app/spar";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/app?intent=spar&login=1`);
}
