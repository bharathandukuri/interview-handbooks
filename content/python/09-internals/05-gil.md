---
type: question
title: "The Global Interpreter Lock (GIL)"
difficulty: hard
mostAsked: true
tags: [gil, concurrency, cpython]
revision:
  - "The GIL allows only one thread to execute Python bytecode at a time in standard CPython"
  - "I/O-bound threads release the GIL while waiting — threading still helps there"
  - "CPU-bound work bypasses the GIL with `multiprocessing` or C extensions (NumPy)"
  - "Python 3.13 adds experimental free-threaded mode (PEP 703, `--disable-gil`)"
---

## Answer

The **GIL** (Global Interpreter Lock) is a mutex inside CPython that prevents multiple OS threads from executing Python bytecode simultaneously. It protects CPython's reference-counting memory management from race conditions without per-object locking overhead.

**When the GIL matters (and when it doesn't):**

- **CPU-bound Python code:** Threads contend on the GIL and run no faster (often slightly slower) than single-threaded code. Use `multiprocessing` or C/Rust extensions that release the GIL.
- **I/O-bound code:** Network, disk, and `time.sleep` release the GIL while waiting, so `threading` and `asyncio` scale well.
- **Python 3.13+ (PEP 703):** Introduces experimental **free-threaded** builds (`python3.13t` / `--disable-gil`), replacing the GIL with biased reference counting and fine-grained locks.

## Why interviewers ask

The GIL is the cornerstone of Python concurrency design — interviewers want to see you pick `asyncio`/`threading` vs `multiprocessing` for the right reasons.

## Follow-ups

- Why did PEP 703 take years to implement without hurting single-threaded performance?
- How do C extensions like NumPy achieve true multi-core parallelism despite the GIL?
