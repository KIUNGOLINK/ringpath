import { HomeTab } from "./HomeTab";
import { CampTab } from "./CampTab";
import { TeamTab } from "./TeamTab";
import { PassportTab } from "./PassportTab";
import type { BoxerAppApi } from "./useBoxerApp";

export function AppShellContent({ api }: { api: BoxerAppApi }) {
  const { activeTab } = api.state;
  if (activeTab === "home") return <HomeTab api={api} />;
  if (activeTab === "camp") return <CampTab api={api} />;
  if (activeTab === "team") return <TeamTab api={api} />;
  return <PassportTab api={api} />;
}
