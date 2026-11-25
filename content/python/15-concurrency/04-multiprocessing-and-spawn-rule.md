---
type: concept
title: "CPU parallelism with multiprocessing and the spawn __main__ rule"
difficulty: medium
mostAsked: true
tags: [concurrency, multiprocessing, parallelism, gil]
related:
  [
    python.concurrency.concurrency-vs-parallelism-io-vs-cpu,
    python.modules-and-stdlib.name-main-and-project-structure,
  ]
revision:
  - "**`multiprocessing`** creates separate OS processes — each has its own GIL and memory space, achieving true multi-core **parallelism** for CPU-heavy Python code"
  - "On Windows and macOS (`spawn` start method), child processes re-import your script — ALWAYS guard entrypoints with **`if __name__ == '__main__':`**"
  - "Functions and data sent across processes must be **picklable** (top-level `def`, not `lambda`s or nested functions)"
---

When CPU-heavy Python work (crunching millions of numbers, image transforms, heavy pure-Python parsing) needs all CPU cores simultaneously, threads hit the GIL wall. **`multiprocessing`** (and `ProcessPoolExecutor`) bypasses the GIL by launching **separate OS processes**, each running its own Python interpreter and heap across different CPU cores.

**Critical Windows / macOS rule (`spawn` + pickling):**

- On Windows and macOS, Python starts worker processes using **`spawn`** (Linux historically used `fork`, shifting toward `forkserver`/`spawn` in Python 3.14+ for safety with threads).
- Because **`spawn`** starts a clean Python interpreter and imports your module file to locate worker functions:
  1. You **must** wrap process-launching code inside **`if __name__ == "__main__":`** — otherwise each child imports the script, tries to launch _more_ children, and crashes in an infinite loop!
  2. Target functions (`square`) and arguments must be **picklable** (defined cleanly at top level with `def`, **not** `lambda`s or nested closures!).

```python
import subprocess, sys, tempfile
from pathlib import Path

script = """
from concurrent.futures import ProcessPoolExecutor

def square(n):
    return n * n

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as pool:
        print(list(pool.map(square, [2, 3, 4, 5])))
"""

with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "mp_demo.py"
    path.write_text(script, encoding="utf-8")
    res = subprocess.run([sys.executable, str(path)], capture_output=True, text=True, check=True)
    print("Multiprocess output:", res.stdout.strip())
```

The screen shows:

```text
Multiprocess output: [4, 9, 16, 25]
```

**Important trade-offs & edge cases:**

- **Startup & serialization overhead:** Launching processes and serializing (**pickling**) giant arrays across process boundaries takes milliseconds — for tiny fast tasks (`square(5)`), spawning processes is actually _slower_ than a loop! Batch small items (`chunksize=100` in `pool.map`) or save `ProcessPoolExecutor` for heavy chunks (>10–50ms each).
- **Separate memory spaces:** Mutating a global list inside a worker process does **not** update the parent process's list! Return values cleanly from `pool.map` / futures, or use explicit `multiprocessing.Queue` / `multiprocessing.shared_memory`.
- **Bonus (`subprocess.run`):** Note how the wrapper above also used **`subprocess.run(..., check=True, capture_output=True, text=True)`** — the clean way to run external non-Python tools (`git`, `ffmpeg`, CLI tools) safely without shell injection (`shell=False` default with a list of args!).
