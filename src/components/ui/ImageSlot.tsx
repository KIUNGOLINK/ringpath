export function ImageSlot({
  caption,
  radius = 0,
  className = "",
  style,
}: {
  caption: string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden flex items-end ${className}`}
      style={{
        borderRadius: radius,
        background:
          "repeating-linear-gradient(135deg, #181818, #181818 10px, #101010 10px, #101010 20px)",
        ...style,
      }}
    >
      <div className="w-full p-3 bg-gradient-to-t from-black/70 to-transparent">
        <span className="text-[11px] leading-snug text-mist uppercase tracking-wide">
          {caption}
        </span>
      </div>
    </div>
  );
}
