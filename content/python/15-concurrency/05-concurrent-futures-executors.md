---
type: concept
title: "Unified thread & process pools with concurrent.futures"
difficulty: medium
mostAsked: true
tags: [concurrency, executors, futures, stdlib]
related:
  [
    python.concurrency.threading-locks-and-queue,
    python.concurrency.multiprocessing-and-spawn-rule,
  ]
revision:
  - "`ThreadPoolExecutor` and `ProcessPoolExecutor` share an identical clean `with` API returning **`Future`** objects"
  - "`executor.map(fn, items)` preserves **input order**; `as_completed(futures)` yields each task **the moment it finishes**"
---

Managing raw `Thread` lists and shutdown sentinels manually gets tedious quickly. Python's **`concurrent.futures`** wraps both thread pools and process pools behind one clean, identical context-manager API!

Two ways to consume work from an executor (`ThreadPoolExecutor` for I/O; `ProcessPoolExecutor` for CPU):

1. **`executor.map(fn, items)`:** Simple, returns results in the **same order** as `items` (great when order matters; note exceptions only raise when you iterate to that failing item!).
2. **`executor.submit(fn, arg)` -> `Future` + `as_completed()`:** Submits tasks individually, lets you process fast tasks _immediately_ in completion order via `as_completed`, and handles per-task exceptions cleanly!

```python
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_task(item):
    name, delay = item
    time.sleep(delay)
    if name == "bad":
        raise ConnectionError(f"{name} timed out")
    return f"{name}:ok"

jobs = [("slow", 0.04), ("bad", 0.01), ("fast", 0.015)]

with ThreadPoolExecutor(max_workers=3) as pool:
    # 1. Input-ordered map (valid jobs):
    ordered = list(pool.map(fetch_task, [("a", 0.02), ("b", 0.01)]))
    print("map order preserved:", ordered)

    # 2. Completion-order handling with Future & exception isolation:
    future_to_name = {pool.submit(fetch_task, job): job[0] for job in jobs}
    outcomes = []
    for fut in as_completed(future_to_name):
        name = future_to_name[fut]
        try:
            outcomes.append(fut.result())
        except ConnectionError as err:
            outcomes.append(f"{name}:failed({err})")

print("all outcomes sorted:", sorted(outcomes))
```

The screen shows:

```text
map order preserved: ['a:ok', 'b:ok']
all outcomes sorted: ['bad:failed(bad timed out)', 'fast:ok', 'slow:ok']
```

**Important edge cases on executors:**

- **Always iterate or call `.result()` on futures:** Errors raised inside a submitted function are captured inside the `Future` object and **stay silent** until `.result()` (or `.exception()`) is called!
- **`max_workers` limits:** Leaving `max_workers=None` picks sensible defaults (`min(32, cpu_count + 4)` for threads; `os.cpu_count()` for processes), **but** for external APIs you should pass an explicit `max_workers` (e.g., `10`) so you do not overwhelm a database or get rate-limited (`429`).
- **Context manager wait:** Exiting `with ThreadPoolExecutor() as pool:` calls `pool.shutdown(wait=True)`, cleanly waiting for running tasks to finish before moving on.
