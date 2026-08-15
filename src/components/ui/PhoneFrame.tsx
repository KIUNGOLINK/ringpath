import type { ReactNode } from "react";

export function PhoneFrame({
  children,
  overlay,
  dark = true,
  contentBg,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  dark?: boolean;
  contentBg?: string;
}) {
  const c = dark ? "#fff" : "#000";
  return (
    <div className="mx-auto w-[390px] max-w-full shrink-0 [zoom:1] sm:[zoom:1] max-[430px]:[zoom:0.86]">
      <div
        className="relative w-[390px] h-[844px] rounded-[48px] overflow-hidden"
        style={{
          background: dark ? "#000" : "#F2F2F7",
          boxShadow: "0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* dynamic island */}
        <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] rounded-[24px] bg-black z-50" />

        {/* status bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-[18px] pb-[10px]">
          <span className="text-[15px] font-semibold" style={{ color: c }}>
            9:41
          </span>
          <div className="flex items-center gap-[6px]">
            <svg width="17" height="11" viewBox="0 0 19 12">
              <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c} />
              <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c} />
              <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c} />
              <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c} />
            </svg>
            <svg width="24" height="12" viewBox="0 0 27 13">
              <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.4" fill="none" />
              <rect x="2" y="2" width="20" height="9" rx="2" fill={c} />
              <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* content */}
        <div
          className="h-full overflow-y-auto pt-[54px] scrollbar-none"
          style={contentBg ? { background: contentBg } : undefined}
        >
          {children}
        </div>

        {/* overlay layer: bottom nav, sheets, toast — confined to the device bezel */}
        {overlay}

        {/* home indicator */}
        <div className="absolute bottom-0 left-0 right-0 z-50 h-[34px] flex items-end justify-center pb-2 pointer-events-none">
          <div
            className="w-[139px] h-[5px] rounded-full"
            style={{ background: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.25)" }}
          />
        </div>
      </div>
    </div>
  );
}
