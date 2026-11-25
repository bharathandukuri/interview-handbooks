---
type: concept
title: "Numbers: int and float"
difficulty: easy
tags: [numbers, int, float]
revision:
  - "`int` is a whole number, `float` has a decimal point"
  - "Python ints can be as big as you need, so they never overflow"
---

Python has two main kinds of numbers:

- **`int`** is a whole number, like `12`, `0` or `-3`.
- **`float`** is a number with a decimal point, like `9.99` or `-0.5`.

```python
apples = 12        # an int
price = 9.99       # a float
print(apples + 3)
print(price * 2)
print(99999999999 * 99999999999)
```

The screen shows:

```text
15
19.98
9999999999800000000001
```

Use `+`, `-`, `*` and `/` for maths. Chapter 3 covers all the maths signs.

:::insight[No overflow]
In some languages, a number that gets too big breaks or wraps around. Python ints can grow as big as your computer's memory allows.
:::

:::tip[Easy to read big numbers]
Use underscores inside a number: `1_000_000` is the same as `1000000`.
:::
