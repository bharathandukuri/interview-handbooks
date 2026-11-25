---
type: compare
title: "Threads vs processes vs asyncio"
difficulty: hard
mostAsked: true
left: "threading / asyncio"
right: "multiprocessing"
tags: [concurrency, gil, asyncio]
revision:
  - "Use `threading`/`asyncio` for I/O-bound work; `multiprocessing` for CPU-bound (bypasses GIL)"
  - "`asyncio` scales to thousands of concurrent sockets on 1 thread; `threading` uses OS threads"
  - "`concurrent.futures` unifies threads and processes under `Executor`"
---

| Feature           | `threading`                  | `asyncio`                      | `multiprocessing`             |
| ----------------- | ---------------------------- | ------------------------------ | ----------------------------- |
| CPU parallelism   | ❌ Blocked by GIL            | ❌ Single-threaded             | ✅ True multi-core            |
| I/O-bound scaling | Good (tens/hundreds)         | ✅ Best (1000s+)               | Overkill                      |
| Switching         | Preemptive (OS)              | Cooperative (`await`)          | OS processes                  |
| Shared memory     | ✅ Shared heap (needs locks) | ✅ Shared heap (single thread) | ❌ IPC / pipes / pickling     |
| Startup overhead  | Low                          | Very low                       | High (`spawn`/`fork`)         |
| Fault isolation   | Low (shared process)         | Low (shared process)           | ✅ Crash isolated per process |

## Verdict

Pick **`asyncio`** for high-concurrency network services, **`ThreadPoolExecutor`** when wrapping synchronous blocking I/O libraries, and **`ProcessPoolExecutor`** for heavy CPU computation.
