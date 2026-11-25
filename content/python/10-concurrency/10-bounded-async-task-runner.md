---
type: problem
title: "Bounded Concurrent Async Runner"
difficulty: medium
complexity:
  time: "O(n)"
  space: "O(n)"
approach: "asyncio.Semaphore + TaskGroup"
tags: [asyncio, semaphore, concurrency]
---

## Problem

Given a list of `urls` and an async `fetch(url)` coroutine, fetch all URLs concurrently while ensuring **at most `limit` requests run in flight at once**, preserving the input order of results.

```
Input:  urls=["u1", "u2", "u3", "u4"], limit=2
Output: [res1, res2, res3, res4]  (max 2 concurrent)
```

## Hint

- Wrap `fetch(url)` with `async with sem:` using `asyncio.Semaphore(limit)`.
- `asyncio.TaskGroup` lets you schedule all tasks and read `.result()` in original order after the `async with` exits.

## Solution

```python
import asyncio
from collections.abc import Awaitable, Callable

async def fetch_bounded[T](
    urls: list[str],
    fetch_fn: Callable[[str], Awaitable[T]],
    limit: int = 5,
) -> list[T]:
    sem = asyncio.Semaphore(limit)

    async def bounded(url: str) -> T:
        async with sem:
            return await fetch_fn(url)

    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(bounded(u)) for u in urls]
    return [t.result() for t in tasks]
```

## Walkthrough

`asyncio.Semaphore(limit)` caps active `fetch_fn` calls at `limit` without manual batching (unlike naive chunking, where 1 slow URL stalls the whole batch!). `TaskGroup` guarantees all tasks finish (or cancel cleanly on error) before `[t.result() for t in tasks]` collects results in exact input order.
