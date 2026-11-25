---
type: concept
title: "Concurrency vs parallelism: I/O-bound vs CPU-bound"
difficulty: easy
mostAsked: true
tags: [concurrency, architecture, gil]
revision:
  - "**Concurrency** = managing overlapping tasks (e.g. waiting on I/O); **Parallelism** = executing simultaneously on multiple CPU cores"
  - "I/O-bound → `asyncio` or `threading`; CPU-bound → `multiprocessing`"
---

Choosing the right concurrency model starts by identifying your **bottleneck**:

```
Workload
├── I/O-bound (HTTP calls, DB queries, disk reads)
│   ├── High concurrency (1000s of sockets) ──▶ asyncio
│   └── Blocking libraries / simple scripts ──▶ threading / ThreadPoolExecutor
└── CPU-bound (image processing, crypto, ML, heavy loops)
    └── True multi-core execution ──────────▶ multiprocessing / ProcessPoolExecutor
```

**Concurrency** means making progress on multiple tasks over overlapping time slices (one waiter serving 5 tables). **Parallelism** means physically running multiple computations at the exact same instant across CPU cores (5 chefs cooking at once).

Because of CPython's GIL, `threading` and `asyncio` give concurrency (great for I/O), whereas `multiprocessing` gives true CPU parallelism.
