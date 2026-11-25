---
type: problem
title: "Squares of even numbers"
difficulty: easy
complexity:
  time: "One pass through nums (O(n))"
  space: "Stores only matching squares"
approach: "List comprehension combining transform and filter"
tags: [comprehensions, lists, practice]
related: [python.comprehensions-and-sorting.list-comprehensions]
---

## Problem

Given a list of integers `nums` (which may contain zero, negative numbers, or be empty `[]`), use one list comprehension to build a list of the squares of **only the even** numbers.

```text
[-3, -2, 0, 1, 4, 5] -> [4, 0, 16]
[1, 3, 5]            -> []
[]                   -> []
```

## Hint

- Filter condition: `n % 2 == 0` (even numbers include `0` and `-2`!).
- Transform expression on the left: `n ** 2` (or `n * n`).

## Solution

```python
nums = [-3, -2, 0, 1, 4, 5]
result = [n ** 2 for n in nums if n % 2 == 0]
print(result)
```

## Walkthrough

Python evaluates each `n` from left to right:

- `-3 % 2` is `1` (skipped).
- `-2 % 2` is `0` -> included, squared to `(-2) ** 2` = `4`! (Remember: `n` itself gets squared cleanly without the `-2 ** 2 == -4` precedence trap because `n` is a single variable!)
- `0 % 2` is `0` -> `0 ** 2` = `0`.
- `4 % 2` is `0` -> `4 ** 2` = `16`.

If `nums` is `[]` or contains only odd integers, the result is cleanly `[]`.
