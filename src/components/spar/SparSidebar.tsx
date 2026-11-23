"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SparMark } from "./SparLogo";
import { BellIcon, ClockIcon, HomeIcon, PlayIcon, PlusIcon, SearchIcon } from "@/components/icons/Icon";

type NavItem = { href: string; label: string; icon: typeof HomeIcon; exact?: boolean };

const NAV: NavItem[] = [
  { href: "/app/spar", label: "Accueil", icon: HomeIcon, exact: true },
  { href: "/app/spar/find", label: "Trouver un sparring", icon: SearchIcon },
  { href: "/app/spar/create", label: "Créer une session", icon: PlusIcon },
  { href: "/app/spar/timer", label: "Minuteur", icon: PlayIcon },
];

const MEMBER_NAV: NavItem[] = [
  { href: "/app/spar/requests", label: "Mes demandes", icon: BellIcon },
  { href: "/app/spar/history", label: "Historique", icon: ClockIcon },
];

// Desktop-only navigation. On phones the screens keep their own headers.
export function SparSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      const uid = data.session?.user.id;
      setSignedIn(!!uid);
      if (uid) {
        const { data: profile } = await supabase.from("profiles").select("first_name").eq("id", uid).maybeSingle();
        if (!cancelled && profile?.first_name) setFirstName(profile.first_name);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  const items = signedIn ? [...NAV, ...MEMBER_NAV] : NAV;

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-steel bg-obsidian px-4 py-6 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-3 text-bone hover:text-bone">
        <SparMark size={28} />
        <span className="font-condensed text-[28px] font-bold tracking-wide">SPAR</span>
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Navigation Spar">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors ${
                active ? "bg-carbon text-bone hover:text-bone" : "text-mist hover:bg-carbon hover:text-bone"
              }`}
            >
              <Icon size={19} className={active ? "text-fight-red" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-1">
        {signedIn === false && (
          <>
            <Link
              href="/app?intent=spar"
              className="flex h-11 items-center justify-center rounded-pill bg-bone text-sm font-semibold text-obsidian transition-transform hover:scale-[1.02] hover:bg-pure-white hover:text-obsidian"
            >
              Créer un compte
            </Link>
            <Link
              href="/app?login=1"
              className="flex h-11 items-center justify-center rounded-pill border border-steel text-sm font-semibold text-bone hover:text-bone"
            >
              Se connecter
            </Link>
          </>
        )}
        {signedIn && (
          <div className="rounded-card bg-carbon p-3.5">
            <div className="mb-2 truncate text-sm font-semibold text-bone">{firstName || "Mon compte"}</div>
            <button
              onClick={signOut}
              className="cursor-pointer border-none bg-transparent p-0 text-[13px] text-smoke underline underline-offset-4 hover:text-bone"
            >
              Se déconnecter
            </button>
          </div>
        )}
        <Link href="/" className="px-3 text-xs text-smoke hover:text-bone">
          Retour au site
        </Link>
      </div>
    </aside>
  );
}
