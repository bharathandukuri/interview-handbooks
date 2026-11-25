---
type: pitfall
title: "continue before updating the counter in a while loop"
difficulty: medium
mostAsked: true
tags: [loops, while, continue, gotchas]
related: [python.loops.while-loop, python.loops.break-and-continue]
revision:
  - "In a `while` loop, `continue` skips everything below it — including `n += 1` at the bottom!"
  - "Either increment before checking `continue`, or prefer a `for` loop with `range()`"
---

## The trap

```python
n = 0
while n < 5:
    if n == 2:
        continue       # jumps straight back to `while n < 5:`!
    print(n)
    n += 1             # SKIPPED whenever n == 2 -> infinite loop!
```

This prints `0`, `1`, and then freezes forever stuck at `n == 2`!

## The fix

```python
n = 0
while n < 5:
    n += 1             # advance BEFORE calling `continue`
    if n == 2:
        continue
    print(n)
# Or better: use `for n in range(5):` which advances automatically!
```

## Why it happens

In a `for` loop, Python moves automatically to the next item at the start of every iteration, so `continue` is always safe. In a **`while` loop**, incrementing `n += 1` is just a regular line in your loop body. Calling `continue` skips straight to `while n < 5:` without changing `n`, locking the loop on `n == 2` forever!
