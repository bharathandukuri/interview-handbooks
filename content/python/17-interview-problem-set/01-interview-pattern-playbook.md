---
type: concept
title: "Coding interview playbook: spotting patterns, constraints, and Big-O targets"
difficulty: medium
mostAsked: true
tags: [interviews, algorithms, complexity, patterns]
revision:
  - "Map constraints to Big-O: `n <= 10^5` rules out `O(n^2)` -> look for **`O(n)`** (hash map / two pointers / stack) or **`O(n log n)`** (sort / heap)"
  - "Before coding: clarify empty/null inputs, duplicates, negative values, ordering, and mutability"
  - "In Python, keep **`collections.Counter`**, **`defaultdict`**, **`deque`**, **`heapq`**, and **`bisect`** at your fingertips"
---

Strong candidates do not memorize 500 disconnected tricks — they recognize the **underlying pattern** from constraints and input shapes within the first two minutes.

**1. Constraint -> Target Time Complexity & Pattern Guide:**

| Input size (`n`) | Max safe complexity    | Likely Python patterns                                                           |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------- |
| `n <= 20`        | `O(2^n)` or `O(n!)`    | Backtracking, recursion, bitmask subsets                                         |
| `n <= 1,000`     | `O(n^2)`               | 2D DP, nested pairs (`3Sum`), basic adjacency checks                             |
| `n <= 100,000`   | `O(n log n)` or `O(n)` | Sort + two pointers/intervals, `heapq`, hash map, sliding window, stack, BFS/DFS |
| `n >= 1,000,000` | `O(log n)` or `O(n)`   | **Binary search** (`bisect`), math, single-pass streaming                        |

**2. Five-step execution loop in every coding round:**

1. **Clarify edge cases upfront (1 min):** Ask about empty arrays/strings, duplicates, negative numbers, case sensitivity, cycles in graphs, and whether input may be mutated.
2. **State brute force briefly (30 sec):** Establish a baseline (`"Brute force checks all pairs in O(n^2)"`) before improving (`"Using a dict drops lookup to O(1), giving O(n) overall"`).
3. **Trace your optimal plan on a tiny tricky example (`"abba"`, `[1, 4]` + `[4, 5]`):** Catch off-by-one errors _before_ writing code.
4. **Write clean modular Python:** Type-hint parameters clearly, handle edge guards at the top, and avoid mutating input arguments unexpectedly.
5. **Dry-run with concrete inputs & state exact Time + Space Big-O:** Never forget recursion call-stack depth (`O(h)` for trees, `O(V)` for graphs) in space complexity!

```python
from bisect import bisect_left, bisect_right
import heapq

# Built-in Swiss-army-knife helpers worth memorizing cleanly:
sorted_nums = [10, 20, 20, 30]
print("first >= 20 index:", bisect_left(sorted_nums, 20), "| first > 20:", bisect_right(sorted_nums, 20))

heap = [5, 1, 8, 3]
heapq.heapify(heap)                     # O(n) in-place min-heap!
print("smallest 2:", heapq.nsmallest(2, heap), "| popped min:", heapq.heappop(heap))
```

The screen shows:

```text
first >= 20 index: 1 | first > 20: 3
smallest 2: [1, 3] | popped min: 1
```
