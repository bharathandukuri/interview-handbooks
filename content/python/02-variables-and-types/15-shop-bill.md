---
type: problem
title: "Chapter challenge: shop bill"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Convert each input to the right type"
tags: [input, types, practice]
related:
  [
    python.variables-and-types.converting-types,
    python.getting-started.greet-the-user,
  ]
---

## Problem

Ask for an item name, the price of one item, and how many the user wants. Then show the bill.

```text
Item name: Notebook
Price of one: 19.99
How many: 3
Notebook x 3 = 59.97
```

(The words `Notebook`, `19.99` and `3` are what the user types.)

## Hint

- The name stays as text. The price needs `float()`. The count needs `int()`.
- Multiply the price by the count to get the total.
- Use `round(total, 2)` and `sep=""` when you print.

## Solution

```python
name = input("Item name: ")
price = float(input("Price of one: "))
count = int(input("How many: "))

total = price * count
print(name, " x ", count, " = ", round(total, 2), sep="")
```

## Walkthrough

Each answer from `input()` is text, so we change each one into the type it needs: `float` for the price, `int` for the count, and plain text for the name.

`price * count` gives the total. `round(total, 2)` keeps 2 decimal places.

`print()` can show numbers directly, so we do not need `str()` here. With `sep=""`, we control every space ourselves.
