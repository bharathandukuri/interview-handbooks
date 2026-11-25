---
type: problem
title: "Chapter challenge: Sliding Window Rate Limiter per user"
difficulty: medium
mostAsked: true
complexity:
  time: "O(1) amortized per allow() call (each timestamp pushes once and pops once)"
  space: "O(u * limit) across u active users"
approach: "Keep a per-user deque of timestamps in defaultdict(deque), evicting expired timestamps <= now - window before checking len(q) < limit"
tags: [interviews, design, rate-limiter, sliding-window, deque]
related:
  [
    python.modules-and-stdlib.collections-counter-defaultdict-deque,
    python.interview-problem-set.sliding-window-longest-substring-problem,
  ]
revision:
  - "Evict expired timestamps with **`while q and q[0] <= now - self.window:`** (`O(1)` amortized via `deque.popleft()`)"
  - "Only append `now` when **allowed** — rejected requests must NOT consume user quota!"
---

## Problem

Design a per-user **Sliding Window Rate Limiter** `RateLimiter(limit, window_seconds)` with `allow(user_id: str, now: float) -> bool`:

- Allow at most `limit` requests from `user_id` within any sliding `[now - window_seconds, now]` interval (or half-open `[t_old <= now - window]` expires old entries so at `now=10` after requests at `[0]`, window `10` expires timestamp `0` and allows cleanly!).
- Guard `limit <= 0` or `window_seconds <= 0` with `ValueError`.
- Keep rejected calls out of the window (never consume quota on denial!).
- Isolate rate limits independently per `user_id`!

## Hint

- Store `self._windows: defaultdict[str, deque[float]] = defaultdict(deque)`.
- Inside `allow(user_id, now)`: compute `cutoff = now - self.window_seconds`, run `while q and q[0] <= cutoff: q.popleft()`, then check `if len(q) >= self.limit: return False`; otherwise `q.append(now); return True`.

## Solution

```python
from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, limit: int, window_seconds: float) -> None:
        if limit <= 0 or window_seconds <= 0:
            raise ValueError("limit and window_seconds must be > 0")
        self.limit = limit
        self.window_seconds = window_seconds
        self._hits: defaultdict[str, deque[float]] = defaultdict(deque)

    def allow(self, user_id: str, now: float) -> bool:
        q = self._hits[user_id]
        cutoff = now - self.window_seconds
        while q and q[0] <= cutoff:
            q.popleft()
        if len(q) >= self.limit:
            return False
        q.append(now)
        return True

limiter = RateLimiter(limit=2, window_seconds=10.0)
events = [("ada", 1.0), ("ada", 5.0), ("ada", 6.0), ("bob", 6.0), ("ada", 11.0)]
for user, ts in events:
    print(f"({user}, t={ts}) -> {limiter.allow(user, ts)}")
```

## Walkthrough

Trace each event carefully for `limit=2, window=10.0`:

1. `(ada, 1.0)` -> queue becomes `[1.0]` -> `True`
2. `(ada, 5.0)` -> queue becomes `[1.0, 5.0]` -> `True`
3. `(ada, 6.0)` -> `cutoff = -4.0`, nothing evicted, `len == 2 >= 2` -> **`False`** (`6.0` is NOT appended!)
4. `(bob, 6.0)` -> isolated per-user deque `[6.0]` -> **`True`**
5. `(ada, 11.0)` -> `cutoff = 1.0`, `1.0 <= 1.0` evicts `[1.0]` leaving `[5.0]`, so `[5.0, 11.0]` succeeds -> **`True`**!

_(Production edge cases to mention in interviews: guard out-of-order/clock-skew timestamps by tracking monotonically `now`, clean up idle users periodically so memory never leaks for inactive IDs, and use Redis sorted sets or Lua scripts when sharing limits across multiple API servers!)_
