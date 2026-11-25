---
type: predict
title: "elif chain vs consecutive if statements"
difficulty: easy
tags: [decisions, elif, predict]
related: [python.operators-and-decisions.elif-many-choices]
revision:
  - "`elif` stops after the first `True` block; separate `if` statements all test independently"
options:
  - "B, then done"
  - "B, then passed, then done"
  - "B, then C, then passed"
  - "B, then C"
answer: 1
---

Look closely at where `elif` ends and a brand-new `if` starts. Guess what the screen shows.

```python
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")

if score >= 60:
    print("passed")

print("done")
```

## Output

```text
B
passed
done
```

## Explanation

1. **First chain (`score = 85`):**
   - `score >= 90` is `False`.
   - `elif score >= 80` is `True`, so Python prints **`B`** and skips `elif score >= 70` (leaving the first chain).
2. **Independent `if score >= 60:`:** Because it starts with `if` (NOT `elif`), it starts a fresh check! `85 >= 60` is `True`, so Python prints **`passed`**.
3. **Unindented line:** `print("done")` always runs at the end, printing **`done`**.
