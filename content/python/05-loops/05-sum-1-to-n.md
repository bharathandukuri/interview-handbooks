---
type: problem
title: "Sum 1 to n"
difficulty: easy
complexity:
  time: "One step for each number from 1 to n"
  space: "Tiny"
approach: "Accumulator inside range(1, n + 1) with non-positive guard"
tags: [loops, range, edge-cases, practice]
related:
  [python.loops.range-count-numbers, python.loops.running-total-and-counter]
---

## Problem

Ask the user for a whole number `n`, and print the sum of all integers from `1` up to `n` inclusive (`1 + 2 + ... + n`). If `n <= 0`, print `Sum: 0`.

```text
Enter n: 5
Sum: 15
```

```text
Enter n: 0
Sum: 0
```

(The input number is what the user types.)

## Hint

- Initialize `total = 0` before the loop.
- Use `range(1, n + 1)` so `n` itself is included!
- Add `total += num` on each step. What happens naturally when `n <= 0`?

## Solution

```python
n = int(input("Enter n: "))
total = 0

for num in range(1, n + 1):
    total += num

print(f"Sum: {total}")
```

## Walkthrough

Notice two neat details:

1. **`range(1, n + 1)`:** Because `range` stops one before its end argument, passing `n + 1` includes `n` itself (`1, 2, 3, 4, 5` -> `15`).
2. **Edge cases `n = 0` and negative `n`:** When `n = 0`, `range(1, 1)` is empty! When `n = -3`, `range(1, -2)` with positive step `+1` is also empty! So the loop executes `0` times and `total` stays `0` automatically — no extra `if` needed!

:::tip[Bonus O(1) formula]
Once `n >= 0`, Gauss's formula `n * (n + 1) // 2` computes the exact same answer in one instant step!
:::
