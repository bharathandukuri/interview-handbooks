---
type: concept
title: "Nested loops: loops inside loops"
difficulty: medium
tags: [loops, nested-loops, control-flow]
related: [python.loops.range-count-numbers, python.loops.break-and-continue]
revision:
  - "A **nested loop** places an **inner loop** (8-space indent) inside an **outer loop** (4-space indent)"
  - "For **each single turn** of the outer loop, the inner loop runs completely from start to finish"
  - "`break` or `continue` inside the inner loop affects **only the inner loop**, never the outer one"
---

A **nested loop** puts one loop (**the inner loop**) inside the body of another (**the outer loop**). Every time the **outer loop** takes **1 step**, the **inner loop** runs all of its steps from start to finish.

```python
for row in range(1, 4):           # outer loop: 3 turns (8 spaces inside inner)
    for col in range(1, 4):       # inner loop: 3 turns for EACH row
        print(f"{row},{col}", end="  ")
    print()                       # 4 spaces -> runs once per row after inner finishes
```

The screen shows:

```text
1,1  1,2  1,3
2,1  2,2  2,3
3,1  3,2  3,3
```

Notice the indentation and execution count:

- Outer `for`: `0` spaces. `print()` ending each line sits at `4` spaces, so it runs **after** the inner loop finishes each row (`3` times total).
- Inner `print(f"{row},{col}", ...)`: `8` spaces, so it runs **`3 * 3 = 9` times** total.

**Edge case — `break` inside nested loops:** Putting `break` inside the inner `for col` loop stops **only the inner `col` loop** and returns control back to the outer `row` loop! It does not exit the outer loop.
