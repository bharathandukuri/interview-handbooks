---
type: problem
title: "Sliding Window Rate Limiter"
difficulty: hard
complexity:
  time: "O(1) amortized"
  space: "O(window_size)"
approach: "deque sliding window"
tags: [design, deque, sliding-window]
---

## Problem

Design a rate limiter that allows at most `max_requests` requests in any `window_seconds` sliding window. `is_allowed(timestamp)` returns `True` if the request at that timestamp is permitted.

```
limiter = RateLimiter(max_requests=3, window_seconds=10)
limiter.is_allowed(1)   → True   # 1 request in window [1-10]
limiter.is_allowed(5)   → True   # 2 requests
limiter.is_allowed(9)   → True   # 3 requests (at limit)
limiter.is_allowed(10)  → False  # still 3 in window [1-10]
limiter.is_allowed(12)  → True   # window is [3-12]: only ts=5,9 — room for one more
```

## Hint

- Keep only the timestamps within the current window.
- Which end of the structure do you add to? Which end do you evict from?

## Solution

```python
from collections import deque

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self.max_req = max_requests
        self.window = window_seconds
        self.timestamps: deque[int] = deque()

    def is_allowed(self, timestamp: int) -> bool:
        cutoff = timestamp - self.window
        while self.timestamps and self.timestamps[0] <= cutoff:
            self.timestamps.popleft()   # evict expired timestamps
        if len(self.timestamps) < self.max_req:
            self.timestamps.append(timestamp)
            return True
        return False
```

## Walkthrough

The deque holds timestamps of approved requests in the current window. On each call, evict all timestamps older than `timestamp - window` from the front (amortised O(1) since each timestamp is removed at most once). If the remaining count is below `max_requests`, approve the request and append the timestamp. Otherwise, deny. Space is bounded by `max_requests` (the deque never holds more than that many entries). This is the **sliding window log** algorithm — accurate but memory-proportional to request rate. For high-throughput systems, the **sliding window counter** approximation is preferred.
