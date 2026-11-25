---
type: concept
title: "range(): generating number sequences cleanly"
difficulty: easy
mostAsked: true
tags: [loops, range, edge-cases, basics]
related: [python.loops.for-loop-and-strings]
revision:
  - "`range(stop)` runs `0..stop-1`; `range(start, stop)` runs `start..stop-1` (**stop is exclusive**)"
  - "`range(start, stop, step)` controls step size, including backwards with a negative step (`-1`)"
  - "**Edge cases:** `range(5, 0)` with positive default step `+1` yields 0 items; step `0` raises `ValueError`"
---

To repeat an action `n` times or walk through a sequence of integers, use Python's built-in **`range()`**. It supports one, two, or three **arguments**:

- `range(stop)` -> starts at `0`, increments by `1`, stops **before** `stop`.
- `range(start, stop)` -> starts at `start`, increments by `1`, stops **before** `stop`.
- `range(start, stop, step)` -> changes by `step` each turn (positive or negative!).

```python
for i in range(4):               # 0, 1, 2, 3
    print(i, end=" ")
print()

for n in range(1, 5):            # 1, 2, 3, 4 (stops before 5!)
    print(n, end=" ")
print()

for s in range(0, 10, 3):        # step +3 -> 0, 3, 6, 9
    print(s, end=" ")
print()

for d in range(5, 0, -1):        # backwards: stops BEFORE 0 -> 5, 4, 3, 2, 1
    print(d, end=" ")
```

The screen shows:

```text
0 1 2 3
1 2 3 4
0 3 6 9
5 4 3 2 1
```

**Three common edge cases:**

1. **Counting down without negative step:** `range(5, 0)` produces **nothing** (empty), because default step `+1` moves upwards away from `0`! You must pass `-1`.
2. **Step `0` or floats:** `range(1, 5, 0)` raises `ValueError: range() arg 3 must not be zero`. `range()` also accepts **integers only** (use `0.5` -> `TypeError`).
3. **Throwaway loop variable `_`:** If you do not need the number (`for _ in range(3):`), naming it `_` signals "repeat 3 times, ignore the value".
