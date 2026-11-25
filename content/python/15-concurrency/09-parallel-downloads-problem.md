---
type: problem
title: "Chapter challenge: Async parallel downloader with throttling and timeouts"
difficulty: medium
mostAsked: true
complexity:
  time: "O(longest active wave) wall time instead of sum of all delays"
  space: "O(n) task and result storage for n jobs"
approach: "Guard concurrency with asyncio.Semaphore, enforce per-job timeouts with asyncio.timeout, and isolate failures cleanly inside a TaskGroup"
tags: [concurrency, asyncio, semaphore, interview]
related:
  [
    python.concurrency.asyncio-async-await-and-tasks,
    python.concurrency.blocking-the-event-loop-pitfall,
  ]
revision:
  - "Always throttle parallel network calls with **`asyncio.Semaphore(n)`** so your script does not overload servers"
  - "Wrap individual I/O calls with **`asyncio.timeout(...)`** and isolate per-item exceptions so one failed URL does not abort healthy downloads"
---

## Problem

Write `async def download_all(jobs, max_concurrent=2, timeout_s=0.05)` where each item in `jobs` is `(name, delay_s, should_fail)`.

Requirements & edge cases:

- Run downloads concurrently, capped at **`max_concurrent`** simultaneous active downloads (`asyncio.Semaphore`).
- Guard invalid `max_concurrent < 1` (`ValueError`) and empty `jobs` cleanly (`return {}`).
- Apply a per-job **`timeout_s`** deadline using `asyncio.timeout(timeout_s)`: if a job hangs longer than `timeout_s`, record `"timeout"` instead of hanging forever!
- If a job raises an error (`should_fail=True`), isolate that failure as `"error"` without canceling surviving downloads!
- Return a dictionary sorted by job name (or deterministic status dict `{name: status}`).

## Hint

- Inside an inner helper `fetch_one(job, sem, timeout_s)`, enter `async with sem:` and `async with asyncio.timeout(timeout_s):` inside a `try ... except TimeoutError / ConnectionError:` block!
- Because `fetch_one` handles expected per-URL network errors cleanly, `asyncio.TaskGroup()` safely schedules _all_ jobs concurrently without crashing sibling jobs on a single bad URL!

## Solution

```python
import asyncio

async def download_all(jobs, max_concurrent=2, timeout_s=0.05):
    if max_concurrent < 1:
        raise ValueError("max_concurrent must be >= 1")
    if not jobs:
        return {}

    sem = asyncio.Semaphore(max_concurrent)
    results = {}

    async def fetch_one(name, delay_s, should_fail):
        async with sem:
            try:
                async with asyncio.timeout(timeout_s):
                    await asyncio.sleep(delay_s)
                    if should_fail:
                        raise ConnectionError("server returned 500")
                    results[name] = "ok"
            except TimeoutError:
                results[name] = "timeout"
            except ConnectionError:
                results[name] = "error"

    async with asyncio.TaskGroup() as tg:
        for name, delay_s, should_fail in jobs:
            tg.create_task(fetch_one(name, delay_s, should_fail))

    return {k: results[k] for k in sorted(results)}

jobs = [
    ("users.json", 0.01, False),
    ("slow.zip", 0.20, False),
    ("broken.csv", 0.01, True),
    ("orders.json", 0.015, False),
]
print(asyncio.run(download_all(jobs, max_concurrent=2, timeout_s=0.05)))
```

## Walkthrough

Notice how clean production `asyncio` patterns work together here:

1. **`async with sem:` outside `timeout` vs inside:** Putting `async with asyncio.timeout(timeout_s):` _inside_ `async with sem:` starts the timeout clock once the download slot is actually acquired, rather than timing out while politely waiting in the semaphore queue!
2. **Thread safety inside single-threaded `asyncio`:** Writing `results[name] = ...` needs **no** `threading.Lock` because only one coroutine executes between `await` lines on the event loop!
3. **Structured concurrency (`TaskGroup`):** Automatically awaits every task and guarantees zero orphaned background tasks leak if unexpected errors occur.
