---
type: predict
title: "Execution trace with asyncio.gather() and staggered await delays"
difficulty: medium
mostAsked: true
tags: [concurrency, asyncio, trace]
related: [python.concurrency.asyncio-async-await-and-tasks]
revision:
  - "`asyncio.gather(a, b)` starts `a` until its first `await`, switches immediately to `b` until its `await`, and resumes whichever finishes waiting first!"
options:
  - "start A\nstart B\nend B\nend A\n['A', 'B']"
  - "start A\nend A\nstart B\nend B\n['A', 'B']"
  - "start B\nstart A\nend B\nend A\n['B', 'A']"
  - "start A\nstart B\nend B\nend A\n['B', 'A']"
answer: 0
---

```python
import asyncio

async def job(name, delay):
    print("start", name)
    await asyncio.sleep(delay)
    print("end", name)
    return name

async def main():
    res = await asyncio.gather(job("A", 0.04), job("B", 0.01))
    print(res)

asyncio.run(main())
```

## Output

```text
start A
start B
end B
end A
['A', 'B']
```

## Explanation

Two super important `asyncio` rules explain this output:

1. **Interleaved execution (`start A -> start B -> end B -> end A`):** `gather` schedules both coroutines immediately. `"A"` prints `"start A"` and yields at `await asyncio.sleep(0.04)`. Right away, the loop starts `"B"`, which prints `"start B"` and sleeps only `0.01`s — so `"B"` wakes up and finishes (`end B`) before `"A"` wakes up (`end A`)!
2. **`gather()` preserves _argument_ order in its return list:** Even though `"B"` finished first, `asyncio.gather(A, B)` returns `['A', 'B']` matching the order passed into `gather(...)` (use `asyncio.as_completed()` if you want values yielded strictly as each completes!).
