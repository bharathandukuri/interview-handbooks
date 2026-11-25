---
type: concept
title: "Asynchronous Python with asyncio, async/await, gather, TaskGroup, and Semaphore"
difficulty: hard
mostAsked: true
tags: [concurrency, asyncio, async-await, python312]
related: [python.concurrency.concurrency-vs-parallelism-io-vs-cpu]
revision:
  - "`async def` defines a **coroutine function**; calling it returns a coroutine object that runs only when **`await`**ed or scheduled as a Task"
  - "One event loop runs **one coroutine at a time cooperatively** — switching only at `await` points (zero thread-switching overhead!)"
  - "Use **`asyncio.gather`**, **`TaskGroup`** (Python 3.11+ structured concurrency), **`Semaphore`** (throttling), and **`to_thread`** for blocking sync helpers"
---

When an API server or scraper handles **hundreds or thousands** of network connections at once, creating 5,000 OS threads wastes huge memory (~MBs per thread stack). **`asyncio`** runs thousands of lightweight **coroutines** cooperatively on **one single thread** using an **event loop**: whenever one coroutine hits **`await`**, the event loop immediately switches to run another ready coroutine!

```python
import asyncio

async def download(name, delay, sem):
    async with sem:                              # cap max simultaneous active requests!
        await asyncio.sleep(delay)               # yields cleanly to event loop!
        return f"{name}:done"

async def main():
    sem = asyncio.Semaphore(2)                   # at most 2 concurrent downloads at once
    # Structured concurrency with TaskGroup (Python 3.11+): auto-awaits & propagates errors!
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(download("api", 0.02, sem))
        t2 = tg.create_task(download("img", 0.01, sem))
        t3 = tg.create_task(download("css", 0.01, sem))

    # Also bridge synchronous blocking functions cleanly without freezing the loop:
    sync_val = await asyncio.to_thread(sum, [10, 20, 30])
    print("results:", [t1.result(), t2.result(), t3.result()], "| to_thread:", sync_val)

asyncio.run(main())
```

The screen shows:

```text
results: ['api:done', 'img:done', 'css:done'] | to_thread: 60
```

**Key rules & `asyncio` edge cases:**

- **`asyncio.gather()` vs `asyncio.TaskGroup()`:** `gather(*coros, return_exceptions=True)` lets surviving tasks continue and returns exception objects inline; **`TaskGroup`** (Python 3.11+) guarantees no leaked "fire-and-forget" background tasks — if one fails (other than `CancelledError`), `TaskGroup` automatically cancels sibling tasks and raises an **`ExceptionGroup`** (handleable via `except* ValueError:`!).
- **Don't await in a sequential loop expecting concurrency!** Writing `for url in urls: results.append(await fetch(url))` runs every download **one after another**! Schedule tasks together (`gather` / `TaskGroup`).
- **Keep a strong reference to `create_task()` results:** `asyncio` keeps only weak references to background tasks! Store tasks in a `set` or use `TaskGroup` so long-running fire-and-forget tasks are never garbage-collected mid-flight!
- **Timeout safety:** Wrap slow network awaits with **`async with asyncio.timeout(5.0):`** (Python 3.11+) so hung servers never hang your coroutine forever.
