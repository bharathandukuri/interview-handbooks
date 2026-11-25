---
type: concept
title: "`multiprocessing` and `concurrent.futures`"
difficulty: medium
tags: [multiprocessing, futures, concurrency]
---

`multiprocessing` spawns separate OS processes — each with its own Python interpreter and GIL — enabling true multi-core CPU parallelism.

**Prefer `concurrent.futures` for clean pool management:** Both `ThreadPoolExecutor` and `ProcessPoolExecutor` share the exact same API (`submit`, `map`, `as_completed`):

```python
from concurrent.futures import ProcessPoolExecutor, as_completed

def heavy(n: int) -> int:
    return sum(i * i for i in range(n))

if __name__ == "__main__":              # REQUIRED on Windows/macOS (`spawn`)!
    with ProcessPoolExecutor() as pool:
        futures = [pool.submit(heavy, n) for n in [10_000, 20_000]]
        results = [f.result() for f in as_completed(futures)]
```

**Caveats to remember:**

- Arguments and return values are **pickled** between processes — avoid passing huge objects repeatedly, and never pass unpicklable lambdas/closures.
- Always guard `ProcessPoolExecutor` entry points with `if __name__ == "__main__":` or `spawn` will recursively re-import and fork-bomb!
