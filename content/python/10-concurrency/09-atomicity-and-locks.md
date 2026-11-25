---
type: question
title: "GIL, atomicity, and race conditions"
difficulty: medium
tags: [concurrency, gil, threading]
---

## Answer

The GIL guarantees only one thread executes Python bytecode at a time, **not** that multi-step Python statements are atomic. CPython can switch threads between bytecode instructions, so read-modify-write operations like `counter += 1` still race!

```python
import threading

counter = 0
lock = threading.Lock()

def safe_inc() -> None:
    global counter
    for _ in range(100_000):
        with lock:
            counter += 1   # protected: LOAD, ADD, STORE cannot interleave
```

Without `with lock:`, 4 threads running `counter += 1` 100,000 times each will frequently end up below `400_000`.

## Why interviewers ask

Many developers mistakenly think _"Python has the GIL, so I don't need locks"_ — a classic source of subtle production race conditions.

## Follow-ups

- What is the difference between `threading.Lock` and `threading.RLock`?
- How do you prevent deadlocks when acquiring multiple locks (lock ordering / `try-lock` timeouts)?
