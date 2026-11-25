---
type: problem
title: "Times table grid"
difficulty: medium
complexity:
  time: "Rows x columns steps"
  space: "Tiny"
approach: "Nested for loops with fixed-width f-string formatting"
tags: [loops, nested-loops, formatting, practice]
related: [python.loops.nested-loops, python.strings.f-strings]
---

## Problem

Use nested `for` loops to print a neat `1` to `5` multiplication table grid where columns align vertically.

```text
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

## Hint

- Use an outer loop `for row in range(1, 6):` and an inner loop `for col in range(1, 6):`.
- Format each cell with `f"{row * col:4}"` and `end=""` so numbers sit side by side cleanly right-aligned to 4 spaces.
- Call a bare `print()` at the 4-space indentation level after the inner loop ends.

## Solution

```python
for row in range(1, 6):
    for col in range(1, 6):
        print(f"{row * col:4}", end="")
    print()
```

## Walkthrough

In `{row * col:4}`, `:4` sets a minimum column width of 4 characters and right-aligns numbers by default (`   1`, `  10`, `  25`). Because every single-digit and two-digit product fits within 4 spaces, all five columns align down the page!

Notice the indentation: `print(f"{row * col:4}", end="")` stays inside the inner loop (running `5 * 5 = 25` times), while `print()` ends the current line once after every row finishes (`5` times).
