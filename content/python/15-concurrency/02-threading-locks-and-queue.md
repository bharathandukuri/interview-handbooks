---
type: concept
title: "Threads, Lock, RLock, and thread-safe queue.Queue"
difficulty: medium
mostAsked: true
tags: [concurrency, threading, locks, queue]
related:
  [
    python.concurrency.concurrency-vs-parallelism-io-vs-cpu,
    python.concurrency.race-condition-despite-gil-pitfall,
  ]
revision:
  - "Spawn threads with `threading.Thread`, start with `.start()`, and wait for completion with `.join()`"
  - "Protect shared mutable state using **`with lock:`** (`threading.Lock` or re-entrant `RLock`)"
  - "Coordinate producer/worker pipelines cleanly using **`queue.Queue`** instead of manual lists + locks"
---

Python's `threading` module runs multiple OS **threads** inside a single process, sharing the same variables in memory (and releasing the GIL whenever waiting on I/O or `time.sleep()`).

Because multiple threads share memory, updating the same data simultaneously requires synchronization tools:

- **`threading.Lock()`:** Allows only one thread inside a `with lock:` critical section at a time. (Using `with lock:` guarantees release even on exceptions — never pair manual `.acquire()`/`.release()` without `try/finally`!)
- **`threading.RLock()` (re-entrant lock):** Like `Lock`, **but** the _same_ thread owning it can acquire it again cleanly (helpful in recursive or helper methods), whereas a normal `Lock` would deadlock itself!
- **`queue.Queue()`:** A battle-tested **thread-safe FIFO queue** handling internal locking and blocking `.get()` cleanly for producer/consumer worker threads.

```python
import queue
import threading

results_lock = threading.Lock()
work_q = queue.Queue()
processed = []

def worker():
    while True:
        item = work_q.get()
        if item is None:                # sentinel tells worker to exit cleanly!
            work_q.task_done()
            break
        with results_lock:
            processed.append(item * 10)
        work_q.task_done()

threads = [threading.Thread(target=worker) for _ in range(2)]
for t in threads:
    t.start()

for val in [1, 2, 3]:
    work_q.put(val)
for _ in threads:
    work_q.put(None)                    # one shutdown sentinel per worker

work_q.join()
for t in threads:
    t.join()

print("Sorted processed items:", sorted(processed))
```

The screen shows:

```text
Sorted processed items: [10, 20, 30]
```

**Important edge cases on threads:**

- **Daemon threads (`daemon=True`):** Non-daemon threads keep Python alive until `.join()` finishes; `daemon=True` background threads die abruptly when the main thread exits without running `finally:` cleanup! Prefer clean sentinels (`None`) and `.join()` so state shuts down gracefully.
- **Deadlocks:** If Thread A holds `lock_1` and waits for `lock_2` while Thread B holds `lock_2` and waits for `lock_1`, both hang forever! Always acquire multiple locks in one consistent global order (or use higher-level queues/executors).
- **Determinism note:** Threads run in OS scheduling order — that is why our example prints `sorted(processed)` cleanly (`[10, 20, 30]`) rather than assuming which worker ran first!
