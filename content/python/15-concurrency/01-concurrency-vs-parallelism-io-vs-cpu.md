---
type: concept
title: "Concurrency vs parallelism, and I/O-bound vs CPU-bound work"
difficulty: medium
mostAsked: true
tags: [concurrency, parallelism, gil, architecture]
related: [python.how-python-works-inside.gil-and-free-threaded-python]
revision:
  - "**Concurrency** overlaps waiting periods across many tasks; **parallelism** executes multiple computations at the exact same instant across CPU cores"
  - "Use **`asyncio`** or **`threading`** for **I/O-bound** work (APIs, databases, files); use **`multiprocessing`** (or C extensions) for **CPU-bound** pure-Python work"
---

Before picking `threading`, `multiprocessing`, or `asyncio`, pause and ask **two** questions:

1. Are we **waiting** on external systems, or **computing** inside the CPU?
2. Do we need **concurrency** or true **parallelism**?

Think of a kitchen:

- **Concurrency** is **1 chef** putting soup on the stove, chopping onions while it simmers, and checking the oven while sauce reduces — one person overlapping idle wait times so everything finishes sooner!
- **Parallelism** is **4 chefs** chopping 4 bowls of vegetables simultaneously on separate cutting boards (**multiple CPU cores** working at the exact same instant!).

| Workload type                 | Examples                                  | Bottleneck          | Best Python tool                                       |
| ----------------------------- | ----------------------------------------- | ------------------- | ------------------------------------------------------ |
| **I/O-bound** (many wait)     | 500 HTTP calls, DB queries, chat sockets  | Waiting on network  | **`asyncio`** (thousands of tasks) or **`threading`**  |
| **I/O-bound** (blocking libs) | Legacy DB/disk libraries without `async`  | Blocking C/OS calls | **`ThreadPoolExecutor`** (releases GIL while waiting!) |
| **CPU-bound**                 | Image resizing, ML prep, parsing 1M rows  | CPU cycles          | **`ProcessPoolExecutor`** / **`multiprocessing`**      |
| **External CLI programs**     | Running `ffmpeg`, `git`, `pytest` cleanly | Separate OS binary  | **`subprocess.run()`**                                 |

**Why this rule saves months of frustration:** Running CPU-heavy pure Python loops in 8 threads under the standard GIL is _still_ sequential (`1x` speed, or slower from lock switching!). Conversely, spawning 500 OS processes to fetch 500 tiny URLs wastes gigabytes of RAM when one single-threaded `asyncio` loop handles 500 sockets in milliseconds!
