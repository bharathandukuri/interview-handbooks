---
type: pitfall
title: "Blocking the asyncio event loop with time.sleep() or synchronous HTTP"
difficulty: medium
mostAsked: true
tags: [concurrency, asyncio, performance, gotchas]
related: [python.concurrency.asyncio-async-await-and-tasks]
revision:
  - "`asyncio` runs on a **single thread** — calling blocking `time.sleep()`, `requests.get()`, or heavy CPU code inside `async def` freezes **every** active coroutine"
  - "Use non-blocking `await asyncio.sleep()`, an async library, or **`await asyncio.to_thread(...)`** for synchronous functions"
---

## The trap

```python
import asyncio, time

async def slow_worker(name):
    print(f"start {name}")
    time.sleep(0.05)                  # BLOCKS the entire event loop thread!
    print(f"end   {name}")            # runs sequentially: start A -> end A -> start B -> end B!

async def main():
    await asyncio.gather(slow_worker("A"), slow_worker("B"))

asyncio.run(main())
```

## The fix

```python
import asyncio, time

async def fast_worker(name):
    print(f"start {name}")
    await asyncio.sleep(0.05)         # yields control cleanly while waiting!
    # Or for unavoidable sync functions: await asyncio.to_thread(time.sleep, 0.05)
    print(f"end   {name}")

async def main():
    await asyncio.gather(fast_worker("A"), fast_worker("B"))

asyncio.run(main())
```

## Why it happens

Because `asyncio` executes all coroutines cooperatively on **one OS thread**, the event loop only switches tasks when execution hits an **`await`** expression. Calling regular `time.sleep(0.05)` (or `requests.get()`, `open(...).read()`, or `hashlib.pbkdf2_hmac(...)`) does **not** yield to the event loop — it puts that single thread completely to sleep, stalling thousands of other connected clients behind it! Always replace synchronous waits inside `async def` with native async libraries (`httpx.AsyncClient`, `aiofiles`) or offload blocking sync calls to a worker thread with **`await asyncio.to_thread(fn, *args)`**.
