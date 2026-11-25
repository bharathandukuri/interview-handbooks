---
type: problem
title: "Temperature converter (Celsius to Fahrenheit)"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Convert input with float(), apply Celsius-to-Fahrenheit formula cleanly, and round to 1 decimal place"
tags: [input, float, numbers, practice]
related:
  [
    python.getting-started.input-text-trap,
    python.variables-and-types.converting-types,
  ]
---

## Problem

Read a temperature in **Celsius** and convert it to **Fahrenheit** rounded to **1 decimal place**, using:

$$\text{fahrenheit} = \text{celsius} \times \frac{9}{5} + 32$$

Test boundary/edge cases cleanly too:

- `0`°C -> `32.0`°F (freezing)
- `100`°C -> `212.0`°F (boiling)
- **`-40`°C -> `-40.0`°F** (the unique crossing point where both scales match!)
- `36.6`°C (decimals -> use `float()`, not `int()`!)

```text
Celsius: 37
Fahrenheit: 98.6
```

## Hint

- Wrap `input("Celsius: ")` with **`float(...)`** rather than `int(...)` so decimal temperatures like `36.6` do not crash with `ValueError`.
- Multiplication `*` and division `/` happen **before** addition `+ 32` automatically.
- Use `round(fahrenheit, 1)` to trim binary float tail noise.

## Solution

```python
celsius = float(input("Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print("Fahrenheit:", round(fahrenheit, 1))
```

## Walkthrough

1. `input("Celsius: ")` returns a string like `"37"` or `"-40"` or `"36.6"`.
2. **`float(...)`** converts both integer strings and decimal strings cleanly (unlike `int("36.6")`, which would fail!).
3. `celsius * 9 / 5 + 32` produces `98.60000000000001` for `37` in binary float — **`round(fahrenheit, 1)`** cleans that binary noise straight to **`98.6`**, and handles `-40 -> -40.0` cleanly!
