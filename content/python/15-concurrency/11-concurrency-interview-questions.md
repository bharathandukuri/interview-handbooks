---
type: question
title: "Concurrency in Python: threading vs multiprocessing vs asyncio and race conditions"
difficulty: hard
mostAsked: true
tags: [concurrency, asyncio, threading, multiprocessing, interviews]
related:
  [
    python.concurrency.threading-vs-multiprocessing-vs-asyncio,
    python.concurrency.race-condition-despite-gil-pitfall,
    python.concurrency.blocking-the-event-loop-pitfall,
  ]
revision:
  - "Use **`asyncio`** / **`threading`** for **I/O-bound** work (threads release GIL on I/O) and **`multiprocessing`** for **CPU-bound** work (separate GILs)"
  - "The GIL does NOT prevent Python-level **race conditions** (`counter += 1`); protect shared thread state with `Lock` or `queue.Queue`"
  - "In `asyncio`, avoid blocking the event loop thread (`asyncio.to_thread` for sync libs); in `multiprocessing`, guard entrypoints with `if __name__ == '__main__':`"
---

## Answer

Python concurrency interviews evaluate whether you can pick the right model and avoid subtle failure modes:

1. **Which model for which workload?**
   - **I/O-bound (high concurrency, async SDKs):** **`asyncio`** — single-threaded event loop scaling cleanly to thousands of connections via `await`, `TaskGroup`/`gather`, `Semaphore` throttling, and `asyncio.timeout`. Offload unavoidable synchronous blocking helpers with **`asyncio.to_thread()`**.
   - **I/O-bound (blocking third-party libs):** **`ThreadPoolExecutor`** (`threading`) — OS threads release the GIL while waiting on I/O, making `ThreadPoolExecutor` simple when dependencies lack `async` support.
   - **CPU-bound (pure-Python number crunching):** **`ProcessPoolExecutor`** (`multiprocessing`) — launches separate processes with isolated memory and GILs across multiple CPU cores.
2. **Thread race conditions despite the GIL:**
   - The GIL only makes CPython's internal memory safety atomic — compound bytecode updates (`x += 1`, check-then-act `if balance >= amt:`) switch threads mid-operation. Guard critical sections with `with threading.Lock():` or coordinate via `queue.Queue`.
3. **`multiprocessing` `spawn` & serialization rules:**
   - Under `spawn` (Windows/macOS default), child processes re-import the script, requiring **`if __name__ == "__main__":`** and top-level **picklable** functions/data.

**A short answer for an interview:** Choose `asyncio` or `threading` for I/O-bound workloads (using `to_thread` so blocking calls never stall an event loop and `Lock`/`Queue` so threads stay race-free) and `multiprocessing` (`if __name__ == "__main__":`) for CPU-bound work across multiple cores.

## Why interviewers ask

Reaching blindly for threads on CPU loops (zero speedup under the GIL), omitting `Lock` because "Python has the GIL", or calling `requests.get()` inside an `async def` FastAPI endpoint (freezing the whole server!) are classic real-world production incidents.

## Follow-ups

- **"Why does `TaskGroup` beat bare `asyncio.gather` for modern Python error handling?"** `TaskGroup` enforces structured concurrency: if one child task fails, sibling tasks are automatically canceled instead of leaking background work, raising an `ExceptionGroup` catchable via `except*`.
- **"How do `executor.map` and `as_completed` differ in `concurrent.futures`?"** `map` yields results in input order and raises exceptions only when iterating to the failing index; `as_completed` yields each `Future` immediately as soon as it finishes, allowing early processing and per-future try/except handling.
