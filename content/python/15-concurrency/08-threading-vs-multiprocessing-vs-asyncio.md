---
type: compare
title: "threading vs multiprocessing vs asyncio: choosing the right tool"
difficulty: medium
mostAsked: true
left: "threading & asyncio (I/O Concurrency)"
right: "multiprocessing (CPU Parallelism)"
tags: [concurrency, parallelism, asyncio, architecture]
related:
  [
    python.concurrency.concurrency-vs-parallelism-io-vs-cpu,
    python.concurrency.asyncio-async-await-and-tasks,
    python.concurrency.multiprocessing-and-spawn-rule,
  ]
revision:
  - "Choose **`asyncio`** for thousands of concurrent I/O connections with async libraries (`FastAPI`, scrapers)"
  - "Choose **`threading` (`ThreadPoolExecutor`)** for moderate I/O concurrency using standard synchronous libraries (`requests`, SQL drivers)"
  - "Choose **`multiprocessing` (`ProcessPoolExecutor`)** for CPU-bound Python work that needs multiple CPU cores"
---

All three tools speed up programs, **but** picking the wrong one slows execution down, wastes gigabytes of RAM, or adds lock bugs:

| Dimension              | `threading` (`ThreadPoolExecutor`)     | `asyncio` (Event loop + coroutines)     | `multiprocessing` (`ProcessPoolExecutor`) |
| ---------------------- | -------------------------------------- | --------------------------------------- | ----------------------------------------- |
| Best workload          | I/O-bound with sync/blocking libraries | Huge scale I/O-bound (1000s of sockets) | **CPU-bound** computation across cores    |
| Execution model        | OS threads (preemptive switching)      | Single thread (cooperative at `await`)  | Separate OS processes (separate GILs!)    |
| Memory per worker      | Moderate (~MB stack per OS thread)     | Tiny (~KB per coroutine!)               | Heavy (full Python process copy per core) |
| Bypasses standard GIL? | Only during I/O / C extensions         | N/A (single-threaded anyway)            | ✅ Yes (true multi-core parallelism)      |
| Primary bug hazard     | Race conditions -> need `Lock`         | Blocking calls freezing the loop        | Pickling overhead & shared-state sync     |

## Verdict

Follow Python's clean 3-step decision rule:

1. If your bottleneck is **pure-Python CPU math/processing**, use **`ProcessPoolExecutor`** (`multiprocessing`).
2. If your bottleneck is **I/O (APIs, databases, sockets)** and libraries support `async`/`await` (or concurrency exceeds ~50 tasks), choose **`asyncio`**.
3. If your bottleneck is **I/O** using existing synchronous libraries (like standard `requests` or legacy SDKs), use **`ThreadPoolExecutor`** cleanly!
