---
type: concept
title: "break and continue: controlling loop execution"
difficulty: easy
mostAsked: true
tags: [loops, break, continue]
related: [python.loops.range-count-numbers]
revision:
  - "`break` performs an **early exit**: stops the current loop completely and moves past it"
  - "`continue` skips the rest of the **current iteration** and jumps straight to the next turn"
  - "Inside nested loops, `break` and `continue` affect **only the innermost loop**"
---

Sometimes you want to stop a loop early (**early exit**) or skip just one turn without exiting the loop:

- **`break`** exits the loop immediately — no further turns run.
- **`continue`** abandons only the remaining lines inside the **current iteration** and jumps right back to the loop header for the next turn.

```python
for n in range(1, 6):
    if n == 3:
        continue       # skip printing 3, keep looping
    if n == 5:
        break          # exit the whole loop before printing 5
    print(n, end=" ")
```

The screen shows:

```text
1 2 4
```

Watch every single turn (`1..5`):

- `n = 1`: neither `if` is `True` -> prints `1`.
- `n = 2`: neither `if` is `True` -> prints `2`.
- `n = 3`: hits `continue` -> skips `print(n)`, starts next turn.
- `n = 4`: prints `4`.
- `n = 5`: hits `break` -> terminates the loop immediately!

**Edge cases:** In nested loops, `break` exits **only the innermost loop** that contains it. And in a `while` loop, never jump over your counter update with `continue` (see the next card!).
