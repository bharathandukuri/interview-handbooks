---
type: problem
title: "Chapter challenge: Build @timed and @retry decorators"
difficulty: medium
mostAsked: true
complexity:
  time: "O(1) wrapper overhead per call (+ wrapped function work)"
  space: "O(1) per call frame"
approach: "Use functools.wraps, time.perf_counter inside try/finally for @timed, and re-raise the last exception cleanly if all @retry attempts fail"
tags: [decorators, closures, error-handling, interview]
related:
  [
    python.iterators-generators-decorators.decorators-and-functools-wraps,
    python.errors-and-files.raising-and-custom-exceptions,
  ]
revision:
  - "Measure durations with **`time.perf_counter()`** inside `try ... finally:` so timings still log when the function raises"
  - "On `@retry(times=3)`, guard `times >= 1`, loop attempts, and **re-raise (`raise`)** the final error cleanly instead of returning `None`"
---

## Problem

Write two production-ready decorators:

1. **`@timed(stats_log=None)`** (or recording timings): measures execution duration using `time.perf_counter()`, works even if the wrapped function raises an exception (`try ... finally`), preserves `__name__` / `__doc__`, and returns the original value.
2. **`@retry(attempts=3, exceptions=(ValueError,))`**: retries calling the wrapped function up to `attempts` times whenever it raises one of `exceptions`, immediately propagating unexpected exceptions (like `TypeError`), and **re-raising** the final exception if every attempt fails! Reject `attempts < 1` at decoration time (`ValueError`).

## Hint

- Always validate decorator arguments like `if attempts < 1: raise ValueError(...)` immediately inside `retry(...)` (not on the first failed call!).
- Inside `@retry`'s wrapper, use `for attempt in range(1, attempts + 1): try: return fn(*args, **kwargs) except exceptions: if attempt == attempts: raise`. Notice `raise` with no argument re-throws the original traceback cleanly!
- Use `time.perf_counter()` (monotonic high-resolution clock) rather than `time.time()` (which can jump backward on system clock sync!).

## Solution

```python
import time
from functools import wraps

def timed(timings):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                return fn(*args, **kwargs)
            finally:
                elapsed = time.perf_counter() - start
                timings.append((fn.__name__, elapsed >= 0.0))
        return wrapper
    return decorator

def retry(attempts=3, exceptions=(ValueError,)):
    if isinstance(attempts, bool) or not isinstance(attempts, int) or attempts < 1:
        raise ValueError("attempts must be >= 1")
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except exceptions:
                    if attempt == attempts:
                        raise
        return wrapper
    return decorator

log = []
state = {"calls": 0}

@timed(log)
@retry(attempts=3, exceptions=(ConnectionError,))
def fetch_data():
    state["calls"] += 1
    if state["calls"] < 3:
        raise ConnectionError("temporary blip")
    return "OK"

print("result:", fetch_data(), "| calls made:", state["calls"], "| timing log:", log)
```

## Walkthrough

Notice two clean design details:

1. **`try ... finally` in `@timed`:** `return fn(*args, **kwargs)` stays concise while guaranteeing elapsed time is recorded even if `fn` raises an exception!
2. **Exact exception filtering + bare `raise`:** If `fetch_data()` raises a `KeyError` (programmer bug, _not_ in `exceptions=(ConnectionError,)`), `@retry` lets `KeyError` crash immediately instead of blindly retrying a broken bug `3` times. On final retry exhaustion, bare `raise` preserves the complete traceback!
