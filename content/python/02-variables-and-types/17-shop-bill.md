---
type: problem
title: "Chapter challenge: shop bill calculator"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Convert item inputs into exact expected types (str, float, int), compute total, and round currency cleanly"
tags: [input, types, conversions, practice]
related:
  [
    python.variables-and-types.converting-types,
    python.getting-started.greet-the-user,
  ]
---

## Problem

Ask the user for:

1. Item name (text)
2. Price of one item (may include decimals like `19.99` or `0.10`)
3. Quantity (`int` whole count like `3`, including `0` edge case!)

Then compute the bill and print it rounded to 2 decimal places with exact spacing:

```text
Item name: Notebook
Price of one: 19.99
How many: 3
Notebook x 3 = 59.97
```

## Hint

- Match each field to its right type: leave `name` as `str`, parse `price` with `float(...)`, and parse `count` with `int(...)` (why not `float` for count? Because buying `2.5` notebooks makes no sense!).
- Format the line cleanly with `sep=""` and `round(total, 2)` (remember binary float noise like `19.99 * 3 = 59.97` or `0.1 * 3 = 0.30000000000000004`!).

## Solution

```python
name = input("Item name: ")
price = float(input("Price of one: "))
count = int(input("How many: "))

total = price * count
print(name, " x ", count, " = ", round(total, 2), sep="")
```

## Walkthrough

Notice three important lessons combined in this challenge:

1. **Pick the tightest conversion per input:** keeping `name` as `str`, `price` as `float`, and `count` as `int` rejects non-integer counts (`"2.5"`) cleanly while supporting fractional unit prices (`"19.99"`).
2. **`round(total, 2)` cleans binary float tails:** e.g. `0.10 * 3` displays cleanly as `0.3` rather than `0.30000000000000004`! (And in Chapter 04 you will learn f-string precision formatting like `f"{total:.2f}"` so `$0.30` keeps two trailing digits, and in Chapter 12 exact `cents` / `Decimal` math for real billing systems!)
3. **`print()` handles ints and floats directly** alongside strings when passed as separate arguments with `sep=""`.
