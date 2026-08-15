import { ImageSlot } from "@/components/ui/ImageSlot";
import { ConfirmedBadge, VerifiedRow } from "@/components/ui/StatusPill";
import { fighterPassport } from "@/data/mock";

export default function FighterPassport() {
  const p = fighterPassport;
  return (
    <div className="bg-passport-bg text-obsidian min-h-screen px-6 md:px-[72px] py-16 pb-32">
      <div className="max-w-[1152px] mx-auto">
        <div className="text-xs tracking-[0.06em] text-smoke uppercase mb-8">{p.handle}</div>

        <div className="grid md:grid-cols-[360px_1fr] gap-10 md:gap-16 mb-20">
          <ImageSlot
            caption="portrait, 3:4, gym background, directional light"
            radius={16}
            className="w-full max-w-[360px] aspect-[3/4]"
          />
          <div>
            <h1 className="text-5xl md:text-[72px] md:leading-[76px] font-bold text-obsidian mb-4">
              {p.firstName}
              <br />
              {p.lastName}
            </h1>
            <div className="flex flex-wrap gap-4 text-[15px] text-smoke mb-8">
              <span>{p.age}</span>
              <span>·</span>
              <span>{p.weight}</span>
              <span>·</span>
              <span>{p.stance}</span>
              <span>·</span>
              <span>{p.location}</span>
            </div>
            <div className="font-condensed text-7xl md:text-[96px] md:leading-[88px] font-bold text-obsidian">
              {p.record}
            </div>
            <div className="text-xs tracking-[0.06em] text-smoke uppercase mb-4">{p.recordLabel}</div>
            <ConfirmedBadge />
          </div>
        </div>

        <div className="mb-20">
          <div className="text-xs font-semibold tracking-[0.06em] text-smoke uppercase mb-6">
            Achievements
          </div>
          <div className="border-t border-passport-border">
            {p.achievements.map((a) => (
              <div key={a.title} className="flex gap-8 py-6 border-b border-passport-border">
                <span className="font-condensed text-[28px] text-obsidian w-20 shrink-0">{a.year}</span>
                <span className="text-xl text-obsidian">{a.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-xs font-semibold tracking-[0.06em] text-smoke uppercase mb-6">
            Full Fights
          </div>
          <div className="relative rounded-card overflow-hidden">
            <ImageSlot caption="full fight footage thumbnail, 16:9" className="w-full aspect-video" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,.6), transparent 40%)" }}
            />
            <div className="absolute left-6 bottom-6 text-bone">
              <div className="text-xl font-semibold">
                {p.firstName[0]}
                {p.firstName.slice(1).toLowerCase()} {p.lastName[0]}
                {p.lastName.slice(1).toLowerCase()} vs {p.fullFight.opponent}
              </div>
              <div className="text-[13px] text-passport-border">{p.fullFight.event}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          <div>
            <div className="text-xs font-semibold tracking-[0.06em] text-smoke uppercase mb-6">
              Career Journey
            </div>
            <div className="flex flex-col">
              {p.timeline.map((item, i) => (
                <div key={item.year} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: item.highlight ? "#E31B23" : "#070707" }}
                    />
                    {i < p.timeline.length - 1 && (
                      <span className="w-px flex-1 bg-passport-border" />
                    )}
                  </div>
                  <div>
                    <div className="font-condensed text-lg text-smoke">{item.year}</div>
                    <div className="text-base text-obsidian">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-[0.06em] text-smoke uppercase mb-6">
              Trust &amp; Verification
            </div>
            <div className="flex flex-col gap-4">
              {p.trust.map((t) =>
                t.status === "pending" ? (
                  <div key={t.label} className="flex justify-between">
                    <span className="text-[15px] text-obsidian">{t.label}</span>
                    <span className="text-sm font-semibold text-smoke">{t.note}</span>
                  </div>
                ) : (
                  <VerifiedRow key={t.label} label={t.label} status={t.status} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
