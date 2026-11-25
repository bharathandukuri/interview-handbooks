---
type: concept
title: "Augmented assignment: +=, -=, *= and //="
difficulty: easy
tags: [operators, variables, assignment]
related: [python.operators-and-decisions.operator-associativity]
revision:
  - "**Augmented assignment** (`+=`, `-=`, `*=`) updates a variable and saves the result back"
  - "Python computes the **entire right-hand expression** before combining with the left variable"
  - "Be careful not to swap the signs: `=+ 5` sets the variable to positive `5` instead of adding `5`"
---

In Chapter 2 you saw `score = score + 5`. Because updating a variable is so common, Python provides **augmented assignment** (also called **compound assignment**) shortcuts: `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=` (plus bitwise shortcuts like `&=`, `|=`, `<<=`).

```python
score = 10
score += 5        # score = score + 5  -> 15
score -= 3        # score = score - 3  -> 12
score *= 2 + 1    # right side (2 + 1 = 3) runs first! -> 12 * 3 = 36
print(score)
```

The screen shows:

```text
36
```

Look closely at `score *= 2 + 1`:

- Assignment always works **right to left** after every expression on the right finishes.
- So Python evaluates `2 + 1` (`3`) **first**, and then runs `score = 12 * 3` (`36`) — **not** `(12 * 2) + 1 = 25`!

**With strings and other types:** `+=` joins strings (`text += "!"`) and `*=` repeats them (`line *= 3`).

:::pitfall[Typo trap: `+=` vs `=+`]
Writing `score =+ 5` is valid syntax (`score = (+5)`), NOT an error! It silently replaces `score` with `5` instead of adding `5`. Always put the operator **before** `=`.
:::
