---
type: concept
title: "The asyncio event loop"
difficulty: medium
mostAsked: true
tags: [asyncio, event-loop, concurrency]
revision:
  - "Only one coroutine runs at a time; `await` yields control back to the loop"
  - "Use `asyncio.create_task()` for concurrent coroutines; `TaskGroup` in Python 3.11+"
  - "Never call blocking I/O inside `async def` — wrap with `asyncio.to_thread()`"
---

The **event loop** is a single-threaded scheduler that runs coroutines. When a coroutine hits an `await`, it pauses and hands control back to the loop, which can then run another coroutine that's ready.

```python
import asyncio

async def fetch(name: str, delay: float) -> str:
    await asyncio.sleep(delay)   # yields; loop runs other tasks
    return f"{name} done"

async def main():
    # TaskGroup (3.11+): concurrent, structured concurrency
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("A", 0.3))
        t2 = tg.create_task(fetch("B", 0.1))
    # Both finish before we continue; B finishes first internally
    print(t1.result(), t2.result())

asyncio.run(main())
```

The total wall time is ~0.3 s, not 0.4 s — both tasks run concurrently.

**Common pitfall:** `time.sleep()` blocks the entire event loop thread. Use `await asyncio.sleep()` instead, or `await asyncio.to_thread(blocking_fn, ...)` to run blocking code in a thread pool without blocking the loop.

The loop also manages I/O callbacks, signals, and scheduled calls (`loop.call_later`). In production you typically never touch the loop directly — `asyncio.run()` creates and closes it for you.
