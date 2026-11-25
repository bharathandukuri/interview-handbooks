---
type: pitfall
title: "Blocking the asyncio event loop"
difficulty: medium
tags: [asyncio, concurrency, pitfalls]
---

## The trap

```python
import asyncio, time

async def slow_handler():
    time.sleep(2)          # blocks the ENTIRE event loop for 2 seconds!
    return "done"

async def other_task():
    await asyncio.sleep(0) # never gets a chance to run during those 2 s
    return "other"
```

`time.sleep` is a blocking call. It freezes the OS thread, so the event loop cannot run any other coroutine, process I/O events, or fire timers while it blocks.

## The fix

```python
import asyncio

async def slow_handler():
    await asyncio.sleep(2)          # yields; other coroutines run freely

async def cpu_bound_handler():
    result = await asyncio.to_thread(heavy_compute, data)  # runs in a thread
    return result
```

## Why it happens

asyncio is **cooperative**: a coroutine must explicitly `await` something to yield control. Any blocking call (file I/O, `subprocess`, `time.sleep`, slow pure-Python computation) holds the thread and starves every other coroutine.

**Decision tree:**

- Pure async I/O → `await` the async library call
- Blocking I/O unavoidable → `await asyncio.to_thread(fn, ...)`
- CPU-bound → `loop.run_in_executor(ProcessPoolExecutor(), fn, ...)` or separate process
