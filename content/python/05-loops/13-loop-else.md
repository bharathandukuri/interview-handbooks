---
type: concept
title: "Loop else: normal completion vs early break"
difficulty: medium
tags: [loops, break, else, edge-cases]
related: [python.loops.break-and-continue]
revision:
  - "Loop `else:` runs **only** on **normal completion** (if the loop never hit `break`)"
  - "**Edge case:** if the loop runs `0` times (empty string or empty `range`), `else:` still runs because `break` never fired"
---

Python lets you attach an `else:` block right after a `for` or `while` loop. Think of it as **"no-break"** — it runs **only if the loop finished normally without hitting `break`**.

Compare both outcomes side by side:

```python
# Case 1: 'z' is NOT found -> no break -> `else:` runs!
for ch in "python":
    if ch == "z":
        print("Found z!")
        break
else:
    print("Case 1: No z found.")

# Case 2: 'z' IS found -> hits `break` -> `else:` is SKIPPED!
for ch in "zebra":
    if ch == "z":
        print("Case 2: Found z!")
        break
else:
    print("Case 2: No z found.")
```

The screen shows:

```text
Case 1: No z found.
Case 2: Found z!
```

**Why this matters:** Without loop `else:`, searches require creating an extra flag variable like `found = False` before the loop and checking `if not found:` after it.

**Two important edge cases:**

- **`continue` does NOT skip `else:`:** Only `break` skips the `else:` block (`continue` just finishes a turn early).
- **Empty iterable edge case:** Looping over `""` or `range(0)` executes 0 iterations, so `break` never fires — meaning the `else:` block **does** run!
