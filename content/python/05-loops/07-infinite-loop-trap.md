---
type: pitfall
title: "Infinite while loops (and off-target steps)"
difficulty: easy
tags: [loops, while, gotchas, edge-cases]
related: [python.loops.while-loop]
revision:
  - "An **infinite loop** happens when the `while` condition never becomes `False`"
  - "Avoid `!=` when stepping across a number (`n = 5; while n != 0: n -= 2` skips `0` forever!)"
  - "Press :kbd[Ctrl+C] in your terminal to interrupt a runaway program"
---

## The trap

```python
# Bug 1: forgot to update `count`
count = 1
while count <= 3:
    print(count)          # prints 1 forever!

# Bug 2: stepping past the exact check with `!=`
n = 5
while n != 0:             # 5 -> 3 -> 1 -> -1 -> -3 ... NEVER hits 0!
    n -= 2
```

## The fix

```python
count = 1
while count <= 3:
    print(count)
    count += 1            # moves condition toward False

n = 5
while n > 0:              # use `>` / `<=` instead of `!=` so -1 stops safely!
    n -= 2
```

## Why it happens

1. In Bug 1, nothing inside the loop changes `count`, so `1 <= 3` stays `True` forever (**infinite loop**).
2. In Bug 2, odd `5` subtracting `2` steps straight over `0` (`1 - 2 = -1`), so `n != 0` stays `True` forever! Using inequality (`n > 0`) catches overshoots safely.

If you ever trigger an infinite loop in a terminal, press :kbd[Ctrl+C] to raise `KeyboardInterrupt` and stop it.
