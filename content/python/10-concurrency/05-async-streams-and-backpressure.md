---
type: concept
title: "Async streams, `asyncio.Queue`, and `to_thread`"
difficulty: hard
tags: [asyncio, streams, concurrency]
---

Real async services combine streaming protocols, backpressure, and bridges to synchronous libraries:

```python
import asyncio

async def stream_lines(items: list[str]):
    for item in items:
        await asyncio.sleep(0)
        yield item

async def main() -> None:
    async for line in stream_lines(["a", "b"]):   # async iterator
        print(line)

    # Offload blocking sync library (e.g. PIL, sqlite3) safely (3.9+)
    data = await asyncio.to_thread(pow, 2, 1000)
```

**Production async patterns:**

- **`async with` (`__aenter__` / `__aexit__`):** Async DB sessions and HTTP clients (`httpx.AsyncClient`).
- **`asyncio.Semaphore(n)`:** Prevents overwhelming downstream APIs with 10,000 simultaneous requests.
- **`asyncio.Queue(maxsize=100)`:** Bounds memory with natural producer-consumer backpressure.
- **`asyncio.timeout(sec)` (3.11+):** Clean context-manager cancellation for slow network calls.
