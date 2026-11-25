---
type: predict
title: "break inside a nested loop"
difficulty: medium
mostAsked: true
tags: [loops, nested-loops, break, predict]
related: [python.loops.nested-loops, python.loops.break-and-continue]
revision:
  - "`break` inside an inner loop exits **only** the inner loop; the outer loop continues to its next turn"
options:
  - "1-1 | (stops completely)"
  - "1-1 | 2-1 | 3-1 |"
  - "1-1 1-3 | 2-1 2-3 | 3-1 3-3 |"
  - "1-1 1-2 | 2-1 2-2 | 3-1 3-2 |"
answer: 1
---

Remember: does `break` stop the outer loop, or only the inner loop that holds it? Trace the output carefully!

```python
for i in range(1, 4):
    for j in range(1, 4):
        if j == 2:
            break
        print(f"{i}-{j}", end=" ")
    print("|", end=" ")
```

## Output

```text
1-1 | 2-1 | 3-1 |
```

## Explanation

- When `i = 1`: inner `j = 1` prints `1-1 `. Next `j = 2` hits `break`, exiting **only the inner `for j` loop**. Python still runs the line below the inner loop (`print("|", end=" ")`), printing `| `.
- Outer loop moves to `i = 2`: inner `j = 1` prints `2-1 `, `j = 2` breaks the inner loop, outer prints `| `.
- Outer loop moves to `i = 3`: inner `j = 1` prints `3-1 `, `j = 2` breaks the inner loop, outer prints `| `.

If you used `continue` instead of `break`, it would only skip `j = 2` and still print `1-3`, `2-3`, `3-3`!
