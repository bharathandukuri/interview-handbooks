---
type: compare
title: "Threads vs processes vs asyncio"
difficulty: hard
mostAsked: true
left: "threading / asyncio"
right: "multiprocessing"
tags: [concurrency, gil, asyncio]
revision:
  - "Use threads/asyncio for I/O-bound work; `multiprocessing` for CPU-bound (bypasses GIL)"
  - "asyncio is cooperative (single-threaded event loop); threading is preemptive"
  - "`concurrent.futures` unifies both models with `ThreadPoolExecutor` and `ProcessPoolExecutor`"
---

| Feature         | `threading`                 | `asyncio`             | `multiprocessing`     |
| --------------- | --------------------------- | --------------------- | --------------------- |
| Parallelism     | No (GIL)                    | No (single-thread)    | ✅ True parallelism   |
| I/O-bound       | ✅ Good                     | ✅ Excellent          | Overkill              |
| CPU-bound       | ❌ GIL blocks               | ❌ Single-threaded    | ✅ Best choice        |
| Switching       | Preemptive (OS)             | Cooperative (`await`) | Separate processes    |
| Shared memory   | ✅ Shared heap              | ✅ Shared heap        | ❌ Needs pipes/queues |
| Startup cost    | Low                         | Very low              | High (fork/spawn)     |
| Error isolation | Low (crash = process crash) | Low                   | ✅ Isolated processes |

## Verdict

```python
# I/O-bound: asyncio or ThreadPoolExecutor
async def fetch_all(urls):
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(u)) for u in urls]

# CPU-bound: ProcessPoolExecutor
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor() as pool:
    results = list(pool.map(heavy_compute, data))
```

Match the tool to the bottleneck. Mixing asyncio with blocking calls is the most common concurrency bug.
