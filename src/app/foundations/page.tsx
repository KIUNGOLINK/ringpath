import { LogoMark } from "@/components/Logo";
import {
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlayIcon,
  CheckIcon,
  PlusIcon,
  SearchIcon,
  CloseIcon,
} from "@/components/icons/Icon";

const NEUTRALS = [
  { name: "Obsidian", hex: "#070707", swatch: "bg-obsidian border border-steel" },
  { name: "Carbon", hex: "#101010", swatch: "bg-carbon border border-steel" },
  { name: "Graphite", hex: "#181818", swatch: "bg-graphite border border-steel" },
  { name: "Steel", hex: "#292929", swatch: "bg-steel" },
  { name: "Smoke", hex: "#767676", swatch: "bg-smoke" },
  { name: "Mist", hex: "#B7B7B7", swatch: "bg-mist" },
  { name: "Bone", hex: "#F5F3EE", swatch: "bg-bone" },
  { name: "Pure White", hex: "#FFFFFF", swatch: "bg-pure-white border border-steel" },
];

const SEMANTIC = [
  { name: "Success", hex: "#30D158", swatch: "bg-success" },
  { name: "Verified", hex: "#4C8DFF", swatch: "bg-verified" },
  { name: "Warning", hex: "#FFB020", swatch: "bg-warning" },
  { name: "Error", hex: "#E5484D", swatch: "bg-error" },
  { name: "Information", hex: "#7DD3FC", swatch: "bg-information" },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] font-semibold tracking-[0.06em] text-smoke uppercase mb-6">
      {children}
    </div>
  );
}

export default function Foundations() {
  return (
    <div className="px-6 md:px-[72px] py-16 pb-32 max-w-[1296px] mx-auto">
      <div className="text-xs tracking-[0.08em] text-smoke uppercase mb-2">Partie I–X</div>
      <h1 className="text-[56px] leading-[60px] font-bold text-bone mb-16">Foundations</h1>

      {/* logo */}
      <div className="mb-20">
        <SectionLabel>Logo</SectionLabel>
        <div className="flex gap-6 flex-wrap">
          <div className="w-[220px] h-[220px] bg-obsidian border border-steel rounded-card flex items-center justify-center">
            <LogoMark size={72} />
          </div>
          <div className="w-[220px] h-[220px] bg-bone rounded-card flex items-center justify-center">
            <LogoMark size={72} color="#070707" />
          </div>
          <div className="w-[220px] h-[220px] bg-obsidian border border-steel rounded-card flex flex-col items-center justify-center gap-4 relative">
            <LogoMark size={56} />
            <div className="absolute top-14 right-14 w-2 h-2 rounded-full bg-fight-red" />
            <div className="text-[11px] text-smoke">App icon (dot variant)</div>
          </div>
          <div className="w-[220px] h-[220px] bg-obsidian border border-steel rounded-card flex items-center justify-center">
            <span className="text-[22px] font-semibold tracking-[-0.02em] text-bone">RINGPATH</span>
          </div>
        </div>
      </div>

      {/* colors */}
      <div className="mb-20">
        <SectionLabel>Color — Neutrals</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {NEUTRALS.map((c) => (
            <div key={c.name}>
              <div className={`h-24 rounded-md ${c.swatch}`} />
              <div className="mt-2 text-sm text-bone font-semibold">{c.name}</div>
              <div className="text-xs text-smoke">{c.hex}</div>
            </div>
          ))}
        </div>

        <SectionLabel>Fight Red — used sparingly</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div>
            <div className="h-24 rounded-md bg-fight-red" />
            <div className="mt-2 text-sm text-bone font-semibold">Fight Red</div>
            <div className="text-xs text-smoke">#E31B23 · Fight Day, urgency, one CTA per screen</div>
          </div>
        </div>

        <SectionLabel>Semantic — always paired with a text label</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SEMANTIC.map((c) => (
            <div key={c.name}>
              <div className={`h-[72px] rounded-md ${c.swatch}`} />
              <div className="mt-2 text-sm text-bone font-semibold">{c.name}</div>
              <div className="text-xs text-smoke">{c.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* typography */}
      <div className="mb-20">
        <SectionLabel>Typography</SectionLabel>
        <div className="flex gap-16 mb-8 flex-wrap">
          <div>
            <div className="text-sm text-bone font-semibold">Instrument Sans</div>
            <div className="text-[13px] text-smoke">UI, navigation, body, paragraphs</div>
          </div>
          <div>
            <div className="text-sm text-bone font-semibold">Barlow Condensed</div>
            <div className="text-[13px] text-smoke">Performance numbers only</div>
          </div>
        </div>
        <div className="border-t border-steel py-6 text-[72px] leading-[76px] font-bold text-bone">
          Hero XXL / H1
        </div>
        <div className="border-t border-steel py-6 text-[56px] leading-[60px] font-bold text-bone">
          H2 Heading
        </div>
        <div className="border-t border-steel py-6 text-[40px] leading-[44px] font-semibold text-bone">
          H3 Heading
        </div>
        <div className="border-t border-steel py-6 text-[22px] leading-[32px] text-mist">
          Lead paragraph — sets up a section before the detail arrives.
        </div>
        <div className="border-t border-steel py-6 text-base leading-6 text-smoke">
          Body text at 16/24, used for descriptions and long-form copy.
        </div>
        <div className="border-t border-b border-steel py-6 font-condensed text-[72px] leading-[72px] font-bold text-bone flex gap-10 items-baseline flex-wrap">
          <span>37 DAYS</span>
          <span className="text-[40px]">67 KG</span>
          <span className="text-[40px]">14–4</span>
        </div>
      </div>

      {/* spacing */}
      <div className="mb-20">
        <SectionLabel>Spacing — 4px grid</SectionLabel>
        <div className="flex items-end gap-3 flex-wrap">
          {SPACING.map((s) => (
            <div key={s}>
              <div className="bg-bone" style={{ width: s, height: s }} />
              <div className="text-[11px] text-smoke mt-2">{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* radius / borders / shadows */}
      <div className="grid md:grid-cols-3 gap-16 mb-20">
        <div>
          <SectionLabel>Radius</SectionLabel>
          <div className="flex flex-wrap gap-4">
            <div className="w-16 h-16 bg-graphite rounded-sm" />
            <div className="w-16 h-16 bg-graphite rounded-md" />
            <div className="w-16 h-16 bg-graphite rounded-card" />
            <div className="w-16 h-16 bg-graphite rounded-lg" />
            <div className="w-16 h-16 bg-graphite rounded-pill" />
          </div>
        </div>
        <div>
          <SectionLabel>Borders</SectionLabel>
          <div className="flex flex-col gap-3">
            <div className="h-11 rounded-sm border border-steel" />
            <div className="h-11 rounded-sm border border-light-border bg-bone" />
            <div className="h-11 rounded-sm border-2 border-verified" />
          </div>
        </div>
        <div>
          <SectionLabel>Shadows (light contexts)</SectionLabel>
          <div className="flex flex-col gap-4">
            <div className="h-11 rounded-md bg-bone shadow-light-sm" />
            <div className="h-11 rounded-md bg-bone shadow-light-lg" />
          </div>
        </div>
      </div>

      {/* icons */}
      <div>
        <SectionLabel>Iconography — outline, 1.75px stroke, round corners</SectionLabel>
        <div className="flex gap-8 text-bone flex-wrap">
          <BellIcon size={24} />
          <ChevronRightIcon size={24} />
          <ChevronLeftIcon size={24} />
          <PlayIcon size={24} />
          <CheckIcon size={24} />
          <PlusIcon size={24} />
          <SearchIcon size={24} />
          <CloseIcon size={24} />
        </div>
      </div>
    </div>
  );
}
