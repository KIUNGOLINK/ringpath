import { SparSidebar } from "@/components/spar/SparSidebar";

// Spar screens: a sidebar on desktop, the existing full-width phone layout below `lg`.
export default function SparLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-obsidian lg:flex">
      <SparSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
