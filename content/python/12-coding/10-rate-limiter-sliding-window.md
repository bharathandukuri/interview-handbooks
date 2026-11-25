---
type: problem
title: "Sliding Window Rate Limiter"
difficulty: hard
complexity:
  time: "O(1) amortized"
  space: "O(max_requests)"
approach: "deque sliding window"
tags: [design, deque, sliding-window]
---

## Problem

Design a `RateLimiter(max_requests, window_seconds)` where `is_allowed(timestamp)` returns `True` iff fewer than `max_requests` were approved in `(timestamp - window_seconds, timestamp]`.

```
limiter = RateLimiter(max_requests=2, window_seconds=10)
limiter.is_allowed(1)   # True
limiter.is_allowed(5)   # True
limiter.is_allowed(10)  # False
limiter.is_allowed(12)  # True (ts=1 expired)
```

## Hint

- Evict expired timestamps from the left of a `deque` before checking `len(self.timestamps)`.

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
            self.timestamps.popleft()
        if len(self.timestamps) < self.max_req:
            self.timestamps.append(timestamp)
            return True
        return False
```

## Walkthrough

Each approved timestamp is appended once and popped once, yielding amortized O(1) time per call. Bounding stored timestamps to `max_requests` keeps memory predictable per client key.
