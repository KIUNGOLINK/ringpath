import { BellIcon, ChevronRightIcon, CheckIcon, PlayIcon } from "@/components/icons/Icon";
import type { BoxerAppApi } from "./useBoxerApp";

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function HomeTab({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const displayFirstName = (state.firstName || "").toUpperCase();
  const daysOut = daysUntil(state.camp?.fightDate ?? null);

  return (
    <div className="px-5 pb-8 pt-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-steel" />
          <div>
            <div className="text-xs text-smoke">GOOD EVENING,</div>
            <div className="text-lg font-bold text-bone">{displayFirstName}</div>
          </div>
        </div>
        <div className="w-11 h-11 rounded-full bg-graphite flex items-center justify-center text-bone">
          <BellIcon />
        </div>
      </div>

      <div className="relative h-[200px] rounded-lg overflow-hidden mb-8 bg-graphite">
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-[3px] h-3.5 bg-fight-red" />
            <span className="text-xs tracking-[0.06em] text-mist">NEXT FIGHT</span>
          </div>
          {daysOut !== null ? (
            <div>
              <div className="font-condensed text-[64px] leading-[56px] font-bold text-bone">
                {daysOut}
              </div>
              <div className="text-[13px] text-smoke mb-2.5">DAYS</div>
              <div className="flex items-center justify-between text-sm text-bone">
                <span>
                  {displayFirstName} <span className="text-smoke">vs</span> {state.camp?.opponentName}
                </span>
                <span className="text-mist">{state.weight} KG</span>
              </div>
            </div>
          ) : (
            <div className="text-[15px] text-mist">No fight scheduled yet — talk to your coach.</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold text-bone">TODAY</div>
        <div className="text-[13px] text-smoke">View schedule</div>
      </div>

      {state.sessions.length === 0 && (
        <div className="text-[15px] text-smoke mb-6">No sessions yet. Tap + to add one.</div>
      )}

      {state.sessions.map((sess) => (
        <div
          key={sess.id}
          onClick={() => api.openSession(sess.id)}
          className="bg-carbon rounded-card p-4 flex items-center gap-4 mb-3 last:mb-0"
          style={{ cursor: sess.completed ? "default" : "pointer", opacity: sess.completed ? 0.7 : 1 }}
        >
          <div className="text-[15px] font-semibold text-bone w-[52px] shrink-0">{sess.time}</div>
          <div className="flex-1">
            <div className="text-[17px] text-bone">{sess.title}</div>
            <div className="text-[13px] text-smoke">{sess.sub}</div>
          </div>
          {sess.completed ? (
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
              <CheckIcon size={12} className="text-obsidian" />
            </div>
          ) : (
            <ChevronRightIcon size={20} className="text-smoke shrink-0" />
          )}
        </div>
      ))}

      <div className="bg-graphite border-l-2 border-bone rounded-r-md p-4 flex gap-3 my-6">
        <div className="w-7 h-7 rounded-full bg-steel shrink-0" />
        <div>
          <div className="text-xs text-smoke mb-1">{state.coachName ?? "No coach linked"}</div>
          <div className="text-[15px] text-bone">
            {state.coachName ? "Stay behind your jab today." : "Ask your coach for their club code."}
          </div>
        </div>
      </div>

      <div onClick={api.openVideoReview} className="flex gap-3 items-center cursor-pointer">
        <div className="relative w-24 h-[72px] rounded-md overflow-hidden shrink-0 bg-graphite">
          <div className="absolute inset-0 flex items-center justify-center text-bone">
            <PlayIcon size={20} />
          </div>
        </div>
        <div>
          <div className="text-xs text-smoke">VIDEO REVIEW</div>
          <div className="text-[15px] text-bone my-0.5">See it in action</div>
          <div className="text-[13px] text-mist">Preview →</div>
        </div>
      </div>
    </div>
  );
}
