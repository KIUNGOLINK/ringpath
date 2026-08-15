export function Toast({ text }: { text: string }) {
  return (
    <div
      className="absolute left-5 right-5 bottom-[84px] bg-bone text-obsidian text-sm font-semibold px-5 py-3.5 rounded-md text-center z-[200]"
      style={{ boxShadow: "0 8px 30px rgba(0,0,0,.3)" }}
      role="status"
    >
      {text}
    </div>
  );
}
