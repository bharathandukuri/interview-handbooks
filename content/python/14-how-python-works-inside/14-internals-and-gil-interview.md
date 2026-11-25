---
type: question
title: "Python internals: object identity, GC, __slots__, hash tables, and the GIL"
difficulty: hard
mostAsked: true
tags: [internals, gc, slots, gil, interviews]
related:
  [
    python.how-python-works-inside.names-objects-and-id,
    python.how-python-works-inside.reference-counting-gc-and-weakref,
    python.how-python-works-inside.slots-and-memory-optimization,
    python.how-python-works-inside.gil-and-free-threaded-python,
  ]
revision:
  - "`is` tests identity (`id(a) == id(b)`), `==` tests value; never use `is` for numbers/strings due to interning"
  - "CPython frees objects via **reference counting** + **generational cyclic GC** for reference cycles"
  - "`__slots__` cuts per-instance RAM by replacing `__dict__`; compact dicts split sparse `indices` from ordered `entries`"
  - "The **GIL** allows one thread to execute Python bytecode at once (released on I/O), with PEP 703 offering optional `--disable-gil` builds"
---

## Answer

Senior Python interviews dig past syntax into how CPython stores objects, manages memory, and executes threads:

1. **Names, objects, and `is` vs `==`:**
   - Variables are references to heap objects (each with `id`, `type`, `value`). `==` calls `__eq__`, while `is` checks `id(a) == id(b)` (use `is` strictly for `None` and singletons — never integers or strings, which CPython interns unpredictably like `-5..256`).
2. **Memory management (Refcounting + Cyclic GC) and `__slots__`:**
   - Every object maintains a reference count freed the instant it hits `0`. Because cycles (`a -> b -> a`) keep refcounts `>= 1`, CPython pairs refcounting with a **3-generation cyclic garbage collector (`gc`)**. Defining **`__slots__`** replaces per-instance hash-table `__dict__` objects with fixed pointer slots to cut memory on millions of instances.
3. **Dict/Set hash tables:**
   - Dictionaries pair a sparse open-addressing hash-index array (`indices`) with a dense insertion-ordered array (`entries`), achieving amortized `O(1)` lookups while keeping insertion order and trimming RAM overhead.
4. **The GIL & PEP 703:**
   - Standard CPython's **Global Interpreter Lock** ensures only one thread runs Python bytecode at a time (making refcounting fast without per-object locks). Threads still scale well for **I/O** and C extensions (which release the GIL), whereas CPU-bound Python work uses `multiprocessing` — or modern experimental free-threaded CPython (**PEP 703**, `--disable-gil`).

**A short answer for an interview:** Python binds names to heap objects reclaimed immediately by reference counting plus generational cyclic GC for cycles; `__slots__` removes per-instance `__dict__` overhead; dicts use compact open-addressing hash tables; and standard CPython's GIL serializes Python bytecode across threads (released on I/O, optional to disable in PEP 703 builds).

## Why interviewers ask

Understanding how memory, copying, hashing, and the GIL interact prevents production outages: unbounded memory from cyclic references or naive `__dict__` caches, cross-request mutations from shallow copies, and stalled API servers from assuming Python threads magically parallelize CPU loops.

## Follow-ups

- **"Why does `copy.deepcopy` not enter an infinite loop on circular lists (`a = []; a.append(a)`)?"** It maintains a `memo` dictionary mapping original `id(obj)` -> newly allocated clone, returning the cached clone whenever it encounters an already-visited `id`.
- **"Does disabling the GIL (PEP 703) remove the need for `threading.Lock`?"** No! Even in free-threaded Python, non-atomic read-modify-write sequences (`balance += 1` or reading/updating multiple fields together) suffer race conditions and require explicit locks.
