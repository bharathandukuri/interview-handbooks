---
type: concept
title: "Measure before optimizing: timeit, cProfile, and tracemalloc"
difficulty: medium
tags: [performance, profiling, timeit, memory, stdlib]
related: [python.how-python-works-inside.slots-and-memory-optimization]
---

Knuth's famous rule applies strongly to Python: **do not guess where code is slow — measure it first.** Optimizing a line that takes 1% of total runtime wastes hours and ruins readability.

Python ships **three** built-in profiling tools for different bottlenecks:

1. **`timeit`:** Micro-benchmark small snippets reliably over many iterations (turns off GC interference cleanly for micro-timings).
2. **`cProfile` + `pstats`:** Profile an entire program to find which functions burn the most **CPU time** (`tottime` = time _inside_ that function vs `cumtime` = time including sub-calls).
3. **`tracemalloc`:** Track **Python heap allocations** down to the exact filename and line number causing RAM growth!

```python
import cProfile, io, pstats, timeit, tracemalloc

# 1. Micro-timing two ways to build 1,000 squares
t_loop = timeit.timeit("res = []\nfor i in range(1000): res.append(i*i)", number=200)
t_comp = timeit.timeit("[i*i for i in range(1000)]", number=200)
print("Both benchmarks positive?", t_loop > 0 and t_comp > 0)

# 2. CPU function profiling (`cProfile`)
def work():
    return sum(i * i for i in range(5000))

profiler = cProfile.Profile()
profiler.enable()
work()
profiler.disable()
buf = io.StringIO()
pstats.Stats(profiler, stream=buf).sort_stats("tottime").print_stats(1)
print("Profile collected lines > 0?", len(buf.getvalue().splitlines()) > 0)

# 3. Memory allocation tracking (`tracemalloc`)
tracemalloc.start()
big = [i for i in range(50_000)]
current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
print("Peak >= Current > 0?", peak >= current > 0, "| count:", len(big))
```

The screen shows:

```text
Both benchmarks positive? True
Profile collected lines > 0? True
Peak >= Current > 0? True | count: 50000
```

**When to use external profilers too:** `cProfile` only sees _Python function call overhead_ slightly inflated and ignores time inside C libraries or multi-threaded I/O. In production services, engineers reach for low-overhead **sampling profilers** like **`py-spy`** or **`scalene`** (which profiles both Python and C/RAM line-by-line!).
