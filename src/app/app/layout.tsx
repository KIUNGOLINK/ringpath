export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center px-4 py-12 pb-32 bg-obsidian">{children}</div>
  );
}
