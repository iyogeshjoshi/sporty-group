import { useEffect, useRef } from "react";
import type { LeagueBadgeData } from "../../hooks/useLeagueBadge";
import { getSportColor } from "../../lib/sportColor";
import type { AsyncState, League } from "../../types";
import { ErrorState } from "../states/ErrorState";
import { BadgeImage } from "./BadgeImage";
import { LeagueMeta } from "./LeagueMeta";

type BadgeSheetProps = {
  league: League | null;
  state: AsyncState<LeagueBadgeData>;
  onClose: () => void;
  onRetry: () => void;
};

export function BadgeSheet({ league, state, onClose, onRetry }: BadgeSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!league) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [league, onClose]);

  if (!league) return null;

  const accent = getSportColor(league.strSport);

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${league.strLeague} badge`}
        className="relative z-10 flex max-h-[85vh] w-full flex-col gap-4 overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-lg sm:max-w-xl sm:rounded-2xl"
      >
        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 font-body text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
          >
            ✕
          </button>
        </div>

        {state.status === "loading" || state.status === "idle" ? (
          <div className="aspect-square w-full animate-pulse rounded-lg bg-rule" />
        ) : state.status === "error" ? (
          <ErrorState message={state.error.message} status={state.error.status} onRetry={onRetry} />
        ) : (
          <>
            <BadgeImage
              src={state.data.badge?.badgeUrl ?? null}
              alt={`${league.strLeague} badge`}
              accentColor={accent}
            />
            <LeagueMeta
              leagueName={league.strLeague}
              sport={league.strSport}
              season={state.data.badge?.season ?? null}
              alternateName={state.data.detail?.strLeagueAlternate ?? league.strLeagueAlternate}
              description={state.data.detail?.strDescriptionEN ?? null}
              fromCache={state.fromCache}
            />
          </>
        )}
      </div>
    </div>
  );
}
