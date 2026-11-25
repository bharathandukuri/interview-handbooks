---
type: predict
title: "Off-by-one checks and empty ranges"
difficulty: easy
tags: [loops, range, predict, edge-cases]
related: [python.loops.range-count-numbers]
revision:
  - "Missing the final value by `1` is called an **off-by-one error** (`range(1, 5)` stops at `4`)"
  - "`range(5, 0)` without a negative step yields zero items"
options:
  - "1 2 3 4 5, then 5 4 3 2 1"
  - "1 2 3 4, then nothing"
  - "0 1 2 3 4, then 5 4 3 2 1"
  - "1 2 3 4, then ValueError"
answer: 1
---

Look closely at **both** `range()` calls — notice line 4 does NOT pass a step!

```python
for n in range(1, 5):
    print(n, end=" ")
print("|", end=" ")
for k in range(5, 0):
    print(k, end=" ")
print("done")
```

## Output

```text
1 2 3 4 | done
```

## Explanation

1. **First loop (`range(1, 5)`):** `start=1` is inclusive, `stop=5` is **exclusive**, so `n` takes `1, 2, 3, 4` — stopping before `5`. Expecting `5` here is one of the most common **off-by-one errors** in programming.
2. **Second loop (`range(5, 0)`):** Because no `step` was given, Python defaults to `+1`. Since `start` (`5`) is already greater than `stop` (`0`) when moving `+1`, `range(5, 0)` is completely empty and runs **0 times** cleanly (no error!). To count backwards, write `range(5, 0, -1)`.
3. Finally `print("done")` runs at the end, printing `1 2 3 4 | done`.
