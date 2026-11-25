---
type: question
title: "GIL, atomicity, and race conditions"
difficulty: medium
tags: [concurrency, gil, threading]
---

## Answer

The GIL means only one thread executes Python bytecode at a time, but that doesn't make operations **atomic**. The GIL can be released between any two bytecode instructions, so multi-step operations like `counter += 1` (read → add → write) can interleave.

```python
import threading

counter = 0

def increment(n=100_000):
    global counter
    for _ in range(n):
        counter += 1   # 3 bytecodes: LOAD, BINARY_ADD, STORE

threads = [threading.Thread(target=increment) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # likely < 400_000 — race condition!
```

**What IS atomic in CPython (by implementation, not specification):**

- Fetching/storing a simple attribute reference
- `list.append()`, `dict` get/set (single C-level call with GIL held throughout)

**The right fix — use a `Lock`:**

```python
lock = threading.Lock()

def safe_increment(n=100_000):
    global counter
    for _ in range(n):
        with lock:
            counter += 1
```

For simple counters, also consider `threading.local()` per-thread counts merged at the end, or the `queue.Queue` pattern to avoid shared state entirely.

## Why interviewers ask

This catches candidates who assume "GIL = no races" — a dangerous misconception in production multithreaded code.

## Follow-ups

- When is `threading.Lock` vs `threading.RLock` appropriate?
- How do you avoid deadlock with multiple locks?
