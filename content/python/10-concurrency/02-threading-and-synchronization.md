---
type: concept
title: "`threading`, locks, and `queue.Queue`"
difficulty: medium
tags: [threading, locks, concurrency]
---

Python's `threading` module spawns OS threads sharing the same process memory. Because threads share state, any mutable data accessed by multiple threads needs synchronization:

```python
import queue, threading

work: queue.Queue[str] = queue.Queue()
lock = threading.Lock()

def worker() -> None:
    while (item := work.get()) is not None:
        with lock:                  # mutual exclusion
            process(item)
        work.task_done()
```

**Core synchronization primitives:**

- **`Lock` / `RLock`:** `Lock` cannot be acquired twice by the same thread (deadlocks); `RLock` (re-entrant) allows nested acquisition by the owning thread.
- **`Event`:** Simple boolean flag (`set()`, `wait()`) to signal across threads.
- **`Semaphore(n)`:** Caps concurrent access to `n` threads (e.g., DB connection pool).
- **`queue.Queue`:** Thread-safe FIFO queue — prefer message-passing over shared mutable dicts/lists whenever possible.
