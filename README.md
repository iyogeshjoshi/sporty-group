# Sports Leagues

A single-page app for browsing sports leagues from [TheSportsDB](https://www.thesportsdb.com/): search by name, filter by sport, click a league to see its badge.

## Run

```
pnpm install
pnpm dev
```

No `.env` needed — uses TheSportsDB's public free-tier test key (`3`), and CORS is open on their endpoints.

## Project structure

```
src/
├── api/                      # data layer — no React, no cache logic, just HTTP + response shaping
│   ├── client.ts             # fetch wrapper: base URL, 429 retry-with-backoff, error normalization
│   ├── leagues.ts            # getAllLeagues, getLeagueDetail (lookupleague.php enrichment)
│   └── seasons.ts            # getLeagueBadge, guards the seasons string/array trap
├── lib/
│   ├── cache.ts              # read-through cache: TTL, in-flight dedupe, negative caching, sessionStorage
│   ├── sportColor.ts         # sport → accent color, hash fallback for unknown sports
│   └── text.ts               # diacritic-insensitive search matching
├── hooks/                    # the only layer that knows a cache exists; exposes AsyncState<T>
│   ├── useLeagues.ts
│   ├── useLeagueBadge.ts
│   ├── useLeagueFilters.ts   # query/sport state, synced to the URL
│   └── useDebouncedValue.ts
├── components/               # pure/presentational — no fetch, no cache, typed props only
│   ├── AppHeader.tsx
│   ├── FilterBar/
│   │   ├── index.tsx
│   │   ├── SearchInput.tsx
│   │   ├── SportSelect.tsx
│   │   └── ResultCount.tsx
│   ├── LeagueGrid/
│   │   ├── index.tsx         # switches between skeleton / error / empty / grid
│   │   ├── LeagueCard.tsx
│   │   ├── SportChip.tsx
│   │   └── GridSkeleton.tsx
│   ├── BadgeSheet/           # bottom sheet on mobile, dialog on desktop — one component, two layouts
│   │   ├── index.tsx
│   │   ├── BadgeImage.tsx
│   │   └── LeagueMeta.tsx
│   └── states/
│       ├── EmptyState.tsx
│       └── ErrorState.tsx
├── types.ts                  # shared contracts: League, LeagueBadge, LeagueDetail, AsyncState<T>, ...
├── App.tsx                   # composition root — owns selectedLeagueId, derives sports/filteredLeagues
└── main.tsx
```

Data flows one direction: `components → hooks → api/* → lib/cache.ts → api/client.ts`. Components never call `fetch`; the api/lib layers never import React.

## Known limitations

- `strLeagueAlternate` isn't returned by `all_leagues.php` on the free tier, shown as `—`
- Free tier returns a truncated league list (not the full ~1000)
- 30 requests/minute rate limit — the cache is the mitigation; a single retry-with-backoff handles `429`s
