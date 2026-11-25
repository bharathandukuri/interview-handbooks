---
type: problem
title: "Temperature converter"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "float(input()) then maths"
tags: [input, float, practice]
related:
  [
    python.getting-started.input-text-trap,
    python.variables-and-types.converting-types,
  ]
---

## Problem

Ask the user for a temperature in Celsius. Show it in Fahrenheit, rounded to 1 decimal place.

The formula is `fahrenheit = celsius * 9 / 5 + 32`.

```text
Celsius: 37
Fahrenheit: 98.6
```

(The `37` is what the user types.)

## Hint

- `input()` gives text. Turn it into a number first.
- Use `float()` so that decimals like `36.6` work too.
- `round(number, 1)` keeps 1 decimal place.

## Solution

```python
celsius = float(input("Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print("Fahrenheit:", round(fahrenheit, 1))
```

## Walkthrough

`input()` gives the text `"37"`. `float()` turns it into the number `37.0`.

The next line does the maths and saves the result in `fahrenheit`.

Last, `round(fahrenheit, 1)` keeps one decimal place. This also hides any tiny float errors like the ones you saw in the "0.1 + 0.2" card.
