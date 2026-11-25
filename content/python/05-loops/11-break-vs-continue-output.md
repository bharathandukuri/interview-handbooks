---
type: predict
title: "Trace break and continue step by step"
difficulty: medium
tags: [loops, break, continue, predict]
related: [python.loops.break-and-continue]
revision:
  - "`continue` skips remaining lines in the current turn; `break` exits the whole loop immediately"
options:
  - "1 2 3 4"
  - "1 3"
  - "1 3 5"
  - "1 2 3"
answer: 1
---

Trace every turn of `range(1, 6)` carefully and guess what prints.

```python
for n in range(1, 6):
    if n == 2:
        continue
    if n == 4:
        break
    print(n, end=" ")
```

## Output

```text
1 3
```

## Explanation

| Turn | `n` | What happens                                                     | Printed |
| ---- | --- | ---------------------------------------------------------------- | ------- |
| 1    | `1` | Neither `if` matches -> `print(1)` runs                          | `1`     |
| 2    | `2` | `n == 2` hits `continue` -> skips `print(2)`                     | —       |
| 3    | `3` | Neither `if` matches -> `print(3)` runs                          | `3`     |
| 4    | `4` | `n == 4` hits `break` -> exits loop immediately (`5` never runs) | —       |

Notice how `5` is never reached because `break` ended the entire loop on turn 4!
