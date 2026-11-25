---
type: pitfall
title: "Blocking the `asyncio` event loop"
difficulty: medium
tags: [asyncio, concurrency, pitfalls]
---

## The trap

```python
import asyncio, time

async def slow_endpoint():
    time.sleep(2)              # freezes the ENTIRE event loop thread!
    return "done"
```

Every other coroutine, timer, and incoming request stalls for 2 seconds because `time.sleep` (or synchronous `requests.get()`) never yields to the event loop.

## The fix

```python
import asyncio

async def fast_endpoint():
    await asyncio.sleep(2)                       # cooperative yield
    result = await asyncio.to_thread(sync_work)  # offload blocking sync code
    return result
```

## Why it happens

`asyncio` runs all coroutines on a **single OS thread** using cooperative multitasking. Control only switches at `await` points. Any blocking C/OS call (`time.sleep`, `open()` on slow network mounts, synchronous DB drivers) holds the thread hostage until it completes.
