---
type: problem
title: "FizzBuzz"
difficulty: easy
mostAsked: true
complexity:
  time: "Checks each number from 1 to n"
  space: "Tiny"
approach: "Loop 1..n and test divisible-by-both (15) first"
tags: [loops, decisions, interview, edge-cases, practice]
related:
  [
    python.operators-and-decisions.elif-many-choices,
    python.loops.range-count-numbers,
  ]
revision:
  - "Check `i % 3 == 0 and i % 5 == 0` (or `i % 15 == 0`) **first** so multiples of 15 do not get swallowed by 3"
---

## Problem

Ask for a whole number `n` and print every number from `1` to `n`:

- Multiples of **both 3 and 5** -> `FizzBuzz`
- Multiples of **3** only -> `Fizz`
- Multiples of **5** only -> `Buzz`
- Anything else -> the number itself

If `n <= 0`, print nothing (no crash).

```text
Up to: 5
1
2
Fizz
4
Buzz
```

## Hint

- Loop from `1` up to `n` inclusive with `range(1, n + 1)`.
- Remember `elif` picks the **first** match — what happens to `15` if you check `i % 3 == 0` before checking `3` and `5` together?

## Solution

```python
n = int(input("Up to: "))

for i in range(1, n + 1):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```

## Walkthrough

Putting `i % 3 == 0 and i % 5 == 0` at the top ensures `15`, `30`, `45` print `"FizzBuzz"` instead of being caught early by `elif i % 3 == 0:` and printing `"Fizz"`.

**Edge cases:**

- If `n <= 0` (`0` or `-5`), `range(1, n + 1)` yields zero turns cleanly.
- You can also write `if i % 15 == 0:` since `3` and `5` share no common factors other than `1`.
