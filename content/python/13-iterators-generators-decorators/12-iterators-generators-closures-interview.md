---
type: question
title: "Explain iterators, generators, closures, decorators, and context managers"
difficulty: medium
mostAsked: true
tags:
  [iterators, generators, decorators, closures, context-managers, interviews]
related:
  [
    python.iterators-generators-decorators.iterables-and-iterators,
    python.iterators-generators-decorators.generators-and-yield,
    python.iterators-generators-decorators.decorators-and-functools-wraps,
    python.iterators-generators-decorators.custom-context-managers,
  ]
revision:
  - "**Iterables** implement `__iter__()`; **iterators** implement `__iter__()` + `__next__()` (single-pass) and raise `StopIteration`"
  - "**Generators** use `yield` to pause state lazily in `O(1)` memory; **`@wraps(fn)`** preserves metadata inside decorators"
  - "Context managers implement `__enter__`/`__exit__` or `@contextmanager` with `try ... finally:` around `yield`"
---

## Answer

These five features power almost all idiomatic libraries and frameworks in Python:

1. **Iterable vs Iterator vs Generator:**
   - An **iterable** (`list`, `str`, `range`) implements `__iter__()` returning a fresh iterator cursor each time. An **iterator** adds `__next__()` (and returns `self` from `__iter__()`) and raises `StopIteration` when drained — meaning it can be looped **only once**. A **generator** is the concise way to write an iterator using **`yield`** (or `(x for ...)`), pausing its stack frame cleanly between calls in `O(1)` memory.
2. **Closures & `nonlocal`:**
   - A nested function retaining access to enclosing function variables after the outer call returns forms a **closure** (`__closure__`). Use `nonlocal` when rebinding an enclosing variable, and guard loop variables against late binding (`i=i`).
3. **Decorators & `@functools.wraps`:**
   - `@dec` transforms `def fn` via `fn = dec(fn)`. Always place `@functools.wraps(fn)` on `wrapper(*args, **kwargs)` so `__name__`, `__doc__`, and `__wrapped__` stay intact, and always `return fn(*args, **kwargs)`. Stacked decorators apply bottom-up and run top-down.
4. **Custom context managers:**
   - `with obj as x:` guarantees `__exit__(exc_type, exc_val, exc_tb)` runs even on exceptions (return `False`/`None` unless intentionally suppressing an exception). With `@contextlib.contextmanager`, wrap `yield` in `try ... finally:` so teardown runs cleanly on failure; use `ExitStack` for dynamic collections of resources.

**A short answer for an interview:** Iterables create iterators via `__iter__()`, iterators advance one step at a time via `__next__()`, generators build iterators lazily with `yield`, decorators leverage closures (plus `@functools.wraps`) to wrap functions cleanly, and context managers guarantee setup/teardown via `__enter__`/`__exit__` or `@contextmanager` with `try/finally`.

## Why interviewers ask

Frameworks like `pytest` (fixtures with `yield`), FastAPI/Flask (route decorators), SQLAlchemy (session context managers), and streaming pipelines all rely directly on generators, closures, decorators, and context managers. Knowing single-pass exhaustion, `@wraps`, late binding, and `try/finally` around `yield` prevents subtle production bugs.

## Follow-ups

- **"How does `yield from subgen()` differ from `for x in subgen(): yield x`?"** For basic iteration they yield the same items, **but** `yield from` also forwards `.send()` values, `.throw()` exceptions, and `return` values transparently to nested sub-generators (and runs faster in C).
- **"How can you make a decorator work both with and without parentheses (`@dec` AND `@dec(arg=2)`)?"** Inspect the first parameter: `def dec(fn=None, *, arg=2):` — if `fn is None`, return the two-level decorator; if callable `fn` was passed directly (`@dec`), wrap `fn` immediately!
