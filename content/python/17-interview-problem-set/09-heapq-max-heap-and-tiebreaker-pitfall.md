---
type: pitfall
title: "heapq traps: min-heap only and tuple tie-breaker TypeError"
difficulty: medium
mostAsked: true
tags: [interviews, heap, heapq, gotchas]
related: [python.interview-problem-set.heap-top-k-and-merge-k-problem]
revision:
  - "Python's `heapq` is strictly a **min-heap** — negate numeric priorities (or wrap comparison) for max-heap behavior"
  - "Never push `(priority, unorderable_obj)` directly onto a heap — ties compare element 2 and crash with `TypeError` unless you insert a monotonic `seq` counter: **`(priority, seq, obj)`**"
---

## The trap

```python
import heapq

class Task:
    def __init__(self, label):
        self.label = label

pq = []
heapq.heappush(pq, (1, Task("email")))
# heapq.heappush(pq, (1, Task("backup")))
# -> TypeError: '<' not supported between instances of 'Task' and 'Task'!
```

## The fix

```python
import heapq
from itertools import count

class Task:
    def __init__(self, label):
        self.label = label

seq = count()                          # monotonic 0, 1, 2... guarantees NO tuple tie!
max_pq = []
heapq.heappush(max_pq, (-1, next(seq), Task("email")))     # negate priority for max-heap!
heapq.heappush(max_pq, (-5, next(seq), Task("alert")))
heapq.heappush(max_pq, (-5, next(seq), Task("sync")))

while max_pq:
    neg_prio, _, task = heapq.heappop(max_pq)
    print(f"prio={-neg_prio}: {task.label}")
```

## Why it happens

When two heap items share the same first tuple element (`1 == 1` or `-5 == -5`), Python compares the next element (`Task < Task`) to break the tie! Objects without `__lt__` (like linked-list `ListNode`, `Task`, or `dict`) immediately crash with **`TypeError`**. Adding an ever-increasing integer tiebreaker **`next(seq)`** guarantees Python never needs to compare two `Task` objects — _and_ makes same-priority items dequeue cleanly in **FIFO** arrival order!

Also remember **`heapq.heapify(items)`** turns an existing list into a heap in **`O(n)`** time, whereas pushing items one by one takes `O(n log n)`.
