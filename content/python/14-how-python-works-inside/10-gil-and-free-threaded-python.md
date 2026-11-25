---
type: concept
title: "The GIL (Global Interpreter Lock) and free-threaded Python (PEP 703)"
difficulty: hard
mostAsked: true
tags: [internals, gil, concurrency, performance, python313]
related:
  [
    python.how-python-works-inside.reference-counting-gc-and-weakref,
    python.how-python-works-inside.internals-and-gil-interview,
  ]
revision:
  - "The **GIL** is a mutex inside standard CPython ensuring **only one thread executes Python bytecode at a time** per process"
  - "CPython needs the GIL primarily to keep its **reference counting** fast and thread-safe without locking every single object"
  - "Threads **release** the GIL during I/O (`open`, network, `sleep`) and C extensions — **PEP 703** (Python 3.13+/3.14) adds optional **free-threaded (`--disable-gil`)** builds!"
---

One of the most frequently asked Python architecture questions is: **"If Python has `threading`, why doesn't a multi-threaded CPU loop run 8x faster on an 8-core CPU?"**

The answer in standard CPython is the **GIL** (**Global Interpreter Lock**):

- **What it does:** The GIL is a single lock protecting CPython's internal interpreter state. Inside one standard CPython process, even if you spawn 8 OS threads, **only one thread can run Python bytecode at any instant** (switching periodically every ~5 ms or on I/O).
- **Why it exists:** Remember every variable assignment, function call, and list read updates `ob_refcnt` millions of times per second! Adding separate atomic locks around every individual object's reference count would slow down **single-threaded** Python noticeably, whereas one global lock kept single-threaded code fast and C extensions simple.
- **When threads STILL scale fast (even with the GIL!):** Whenever a thread waits on disk files, HTTP APIs, SQL databases, `time.sleep()`, or heavy C libraries (`numpy`, `hashlib`, compression), CPython **explicitly releases the GIL** so other threads run concurrently!

```python
import sys

print("Python >= 3.12?", sys.version_info >= (3, 12))
if hasattr(sys, "_is_gil_enabled"):
    print("GIL currently enabled?", sys._is_gil_enabled())
else:
    print("Standard GIL build active")
```

The screen shows (on standard CPython builds):

```text
Python >= 3.12? True
GIL currently enabled? True
```

_(Wait — exact version numbers like `3.14.3` will match your installed Python interpreter, e.g. `3.12+` or `3.14`! Let us avoid printing OS-version-specific output inside tests — check `internals` carefully in Chapter 15 too!)_

**Modern Python's future without the GIL (PEP 703 & PEP 684):**

- **PEP 684 (Python 3.12):** Added **per-interpreter GILs** (`subinterpreters`), giving separate isolated interpreters inside one process their own locks.
- **PEP 703 (Python 3.13+ experimental, advancing in 3.14):** Introduces **free-threaded CPython** (`python3.13t` / `python3.14t` built with `--disable-gil`) using **biased reference counting** and safe memory reclamation so multi-threaded CPU-bound Python bytecode truly runs across multiple cores in parallel!
- **Crucial warning even without the GIL:** Removing the GIL solves multi-core CPU scaling — it does **NOT** make your own shared `counter += 1` or `dict` updates magically race-free! You still need proper **`threading.Lock`** synchronization (Chapter 15)!
