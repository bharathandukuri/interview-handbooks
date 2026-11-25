---
type: concept
title: "Debugging, profiling, and code quality tooling"
difficulty: medium
tags: [debugging, profiling, tooling]
---

Measure before optimizing — Python's stdlib ships built-in tools for every stage:

```python
import timeit, tracemalloc

# 1. Micro-benchmark small snippets
t = timeit.timeit("'-'.join(map(str, range(100)))", number=10_000)

# 2. Track peak memory allocations
tracemalloc.start()
data = [i * i for i in range(100_000)]
current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
```

**Essential workflow tools:**

- **`breakpoint()` (3.7+):** Drops straight into `pdb` (or configured debugger) at that line; disable in CI via `PYTHONBREAKPOINT=0`.
- **`python -m cProfile -s cumtime app.py`:** Finds which functions consume the most cumulative CPU time.
- **`ruff` & `mypy`/`pyright`:** `ruff check` + `ruff format` lints and formats in milliseconds; `mypy`/`pyright` catches type bugs before runtime.
