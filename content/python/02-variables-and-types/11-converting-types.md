---
type: concept
title: "Changing one type into another"
difficulty: easy
tags: [types, conversion, int, str]
related: [python.getting-started.input-text-trap]
revision:
  - "`int()`, `float()` and `str()` change a value into another type"
  - "`int(3.9)` gives `3`: it cuts off the decimals, it does not round"
  - '`int("abc")` raises a `ValueError`'
---

You can change a value from one type to another.

```python
print(int("12") + 3)
print(float("2.5") + 1)
print(str(7) + " days")
print(int(3.9))
```

The screen shows:

```text
15
3.5
7 days
3
```

- `int()` makes a whole number. `int("12")` turns the text `"12"` into the number 12.
- `float()` makes a decimal number.
- `str()` makes text. This is how you join a number to text.
- `int(3.9)` gives `3`. It **cuts off** the decimals. It does not round.

If the text is not a real number, Python stops with an error:

```python
int("abc")
```

```text
ValueError: invalid literal for int() with base 10: 'abc'
```
