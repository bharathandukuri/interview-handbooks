---
type: problem
title: "Chapter challenge: prime number check"
difficulty: medium
mostAsked: true
complexity:
  time: "Up to square root of n steps"
  space: "Tiny"
approach: "Guard n <= 1, check divisors up to sqrt(n) with loop + else"
tags: [loops, break, maths, edge-cases, practice]
related:
  [
    python.loops.break-and-continue,
    python.loops.loop-else,
    python.operators-and-decisions.even-or-odd,
  ]
revision:
  - "Numbers `<= 1` (`0`, `1`, negatives) are never prime; `2` is the smallest prime number"
  - "Only check divisors up to `int(n ** 0.5) + 1`: any factor bigger than `sqrt(n)` pairs with one smaller"
---

## Problem

A **prime number** is an integer greater than `1` divisible evenly only by `1` and itself (e.g., `2`, `3`, `5`, `7`, `11`).

Ask the user for a whole number `n` and print `Prime` or `Not prime`. Handle important edge cases like `n <= 1`, `2`, `4`, and large primes.

```text
Enter a number: 11
Prime
```

```text
Enter a number: 1
Not prime
```

## Hint

- First guard `if n <= 1:` (`1`, `0`, and negative numbers are never prime!).
- Test possible divisors `d` starting from `2` up to `int(n ** 0.5) + 1`.
- If `n % d == 0`, print `Not prime` and `break`. Attach a loop `else:` to print `Prime` when no divisor divides `n`.

## Solution

```python
n = int(input("Enter a number: "))

if n <= 1:
    print("Not prime")
else:
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            print("Not prime")
            break
    else:
        print("Prime")
```

## Walkthrough

Trace the tricky **edge cases**:

- **`n <= 1` (`-5`, `0`, `1`):** Caught at the top -> `Not prime`.
- **`n = 2`:** `int(2 ** 0.5) + 1` is `2`, so `range(2, 2)` is empty (`0` turns). Because `break` never fires, loop `else:` runs cleanly -> `Prime`!
- **`n = 4`:** `int(4 ** 0.5) + 1` is `3`, so `range(2, 3)` checks `d = 2`; `4 % 2 == 0` -> `Not prime` + `break`!
- **Why stop at `sqrt(n)`?** If `n = 100` factors into `a * b` (say `4 * 25`), one factor (`4`) must be `<= 10`, so you never need to scan past `sqrt(n)`.
