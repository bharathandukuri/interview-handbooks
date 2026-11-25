---
type: predict
title: "Loop `else` and slice bounds"
difficulty: easy
tags: [loops, slicing, control-flow]
options:
  - "found done"
  - "found"
  - "done"
  - "IndexError"
answer: 1
---

```python
s = "abc"
for ch in s[1:99]:
    if ch == "c":
        print("found", end=" ")
        break
else:
    print("done")
```

## Output

```text
found
```

## Explanation

Two Python behaviors are tested here:

1. **Out-of-bounds slicing is safe:** `s[1:99]` silently clamps to the end of `"abc"`, producing `"bc"` without raising `IndexError`.
2. **`for...else` skips `else` on `break`:** The loop visits `'b'`, then `'c'`, prints `found `, and hits `break`. Because it exited via `break`, the `else:` block does **not** run.

Think of `else` on a loop as `"no-break"` — it executes only when the loop exhausts naturally.
