import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PauseIcon, ArrowRightIcon } from "@/components/icons/Icon";

const NAV_ITEMS = ["Product", "Athletes", "Coaches", "Scouting", "About"];

export default function WebHero() {
  return (
    <div className="relative h-screen min-h-[720px] overflow-hidden bg-obsidian motion-reduce:[&_.hero-video]:hidden">
      <ImageSlot
        caption="HERO FILM — hands wrapping, ropes, footwork, pads, coach, bell. Silent, cinematic, 16:9."
        className="hero-video absolute inset-0 w-full h-full"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,7,7,.55) 0%, rgba(7,7,7,.1) 20%, rgba(7,7,7,.15) 60%, rgba(7,7,7,.92) 100%)",
        }}
      />

      <header className="absolute top-0 left-0 right-0 h-[72px] flex items-center justify-between px-6 md:px-[72px]">
        <Logo />
        <nav className="hidden lg:flex gap-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline text-sm font-medium">Log in</span>
          <button className="h-10 px-5 rounded-pill bg-bone text-obsidian text-sm font-semibold cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98]">
            JOIN RINGPATH
          </button>
        </div>
      </header>

      <div className="absolute left-6 md:left-[72px] right-6 md:right-auto bottom-24 md:bottom-24 max-w-[900px]">
        <h1 className="text-[44px] leading-[46px] md:text-[88px] md:leading-[88px] font-bold tracking-[-0.02em] mb-6">
          EVERY ROUND
          <br />
          BUILDS YOUR PATH.
        </h1>
        <p className="text-lg md:text-[22px] md:leading-[32px] text-mist max-w-[560px] mb-8">
          RingPath connects the work you do today with the career you&rsquo;re
          building tomorrow.
        </p>
        <div className="flex flex-wrap gap-6 items-center">
          <Button variant="primary">START YOUR PATH</Button>
          <Link href="/foundations" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-bone">
            See how it works <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>

      <button
        aria-label="Pause background video"
        className="absolute right-6 bottom-6 md:right-8 md:bottom-8 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
        style={{ background: "rgba(255,255,255,.12)" }}
      >
        <PauseIcon />
      </button>
    </div>
  );
}
