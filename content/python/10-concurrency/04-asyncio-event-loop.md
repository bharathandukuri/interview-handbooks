---
type: concept
title: "The `asyncio` event loop and `TaskGroup`"
difficulty: medium
mostAsked: true
tags: [asyncio, event-loop, concurrency]
revision:
  - "Only one coroutine runs at a time; `await` yields control back to the event loop"
  - "Use `asyncio.create_task()` or `asyncio.TaskGroup` (3.11+) to run coroutines concurrently"
  - "`asyncio.timeout(5)` (3.11+) / `asyncio.wait_for()` protects against hanging I/O"
---

`asyncio` provides single-threaded cooperative concurrency via `async def` coroutines and an **event loop**. Calling an `async def` function returns a coroutine object — you must `await` it or schedule it as a `Task`.

```python
import asyncio

async def fetch(name: str, delay: float) -> str:
    await asyncio.sleep(delay)           # yields control to the loop
    return f"{name} ok"

async def main() -> None:
    async with asyncio.TaskGroup() as tg:   # Python 3.11+ structured concurrency
        t1 = tg.create_task(fetch("A", 0.2))
        t2 = tg.create_task(fetch("B", 0.1))
    print(t1.result(), t2.result())         # total time ~0.2s, not 0.3s

asyncio.run(main())
```

**Why `TaskGroup` beats `asyncio.gather`:** If one task raises, `TaskGroup` automatically cancels sibling tasks and raises an `ExceptionGroup` cleanly, preventing orphaned background tasks.
