---
type: problem
title: "Even or odd"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Check n % 2 == 0 with if/else"
tags: [operators, decisions, practice]
related:
  [
    python.operators-and-decisions.maths-operators,
    python.operators-and-decisions.if-and-else,
  ]
---

## Problem

Ask the user for a whole number and print whether it is `Even` or `Odd`. Handle zero and negative numbers properly too.

```text
Enter a number: 14
Even
```

```text
Enter a number: -7
Odd
```

(The number is what the user types.)

## Hint

- Turn the user's answer into a whole number with `int()`.
- A whole number is even when dividing by `2` leaves a remainder of `0`.
- Test `n % 2 == 0` inside an `if / else`.

## Solution

```python
n = int(input("Enter a number: "))

if n % 2 == 0:
    print("Even")
else:
    print("Odd")
```

## Walkthrough

`int(input(...))` converts the text input into an `int`.

Then `n % 2` computes the remainder when dividing `n` by `2`.

- **Positive numbers:** `14 % 2` is `0`, so `14 % 2 == 0` is `True` -> `Even`. `7 % 2` is `1` -> `Odd`.
- **Edge case `0`:** `0 % 2` is `0` -> `Even` (zero is an even integer).
- **Edge case negative numbers:** `-4 % 2` is `0` -> `Even`. `-7 % 2` is `1` (because Python's `%` keeps the divisor's sign), which is `!= 0` -> `Odd`! Note that checking `n % 2 == 1` also works in Python (unlike C/Java where `-7 % 2 == -1`), though `n % 2 == 0` is universally clearer.
