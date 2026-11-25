---
type: question
title: "The Global Interpreter Lock (GIL)"
difficulty: hard
mostAsked: true
tags: [gil, concurrency, cpython]
revision:
  - "The GIL allows only one thread to execute Python bytecode at a time in CPython"
  - "I/O-bound threads release the GIL while waiting — threading still helps there"
  - "CPU-bound work bypasses the GIL with `multiprocessing` or C extensions"
  - "Python 3.13 adds experimental free-threaded mode (PEP 703, `--disable-gil`)"
---

## Answer

The **GIL** (Global Interpreter Lock) is a mutex inside CPython that prevents multiple native threads from executing Python bytecode simultaneously. It protects CPython's reference-counting memory management from race conditions without fine-grained per-object locking.

**What the GIL does and doesn't block:**

```python
import threading

counter = 0

def increment():
    global counter
    for _ in range(100_000):
        counter += 1   # NOT atomic! read-modify-write can race

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)
t1.start(); t2.start()
t1.join();  t2.join()
print(counter)   # < 200_000 is possible despite the GIL
```

The GIL is released every 100 bytecode instructions (or on I/O). This means threads still share time, so non-atomic operations like `counter += 1` can interleave.

**When threads help**: file I/O, network calls, `time.sleep` — the GIL releases while waiting.
**When they don't**: CPU-heavy number crunching — use `multiprocessing` or libraries like NumPy that release the GIL in C code.

## Why interviewers ask

The GIL is a nuanced topic that separates candidates who've hit real concurrency bugs from those who've only read about threading in theory.

## Follow-ups

- How does `multiprocessing` bypass the GIL?
- What is PEP 703 and what trade-offs does free-threading introduce?
