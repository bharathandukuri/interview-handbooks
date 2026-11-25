---
type: concept
title: "elif: multi-way branching vs separate ifs"
difficulty: easy
tags: [decisions, elif, control-flow]
related: [python.operators-and-decisions.if-and-else]
revision:
  - "`elif` checks another condition only when all earlier checks above it were `False`"
  - "In one `if / elif / else` chain (**mutually exclusive branches**), at most **one** block runs"
  - "Putting checks in the wrong order lets an earlier loose check swallow a stricter case below it"
---

When there are more than two possible paths, chain checks with **`elif`** (short for "else if"). An `if / elif / else` chain picks **at most one** branch: Python checks top to bottom, runs the **first** block whose condition is `True`, and skips everything below it.

```python
temp = 28

if temp >= 35:
    print("Very hot")
elif temp >= 20:
    print("Warm")
elif temp >= 10:
    print("Cool")
else:
    print("Cold")
```

The screen shows:

```text
Warm
```

**Important distinctions and edge cases:**

- **`elif` chain vs separate `if` statements:** If we had used three independent `if` lines (`if temp >= 20:` followed by `if temp >= 10:`), then `temp = 28` would print **both** `"Warm"` and `"Cool"`! Use `elif` when choices are **mutually exclusive** (only one should win); use separate `if`s when multiple independent checks can all be true at once.
- **Order matters:** Checking `elif temp >= 10:` before `elif temp >= 20:` would catch `28` at `>= 10` and never reach `"Warm"`. Always list narrower or higher boundary checks before broader ones.
- **`else` is optional:** If no `else` is present and every check is `False`, Python simply skips the entire chain and moves on.
