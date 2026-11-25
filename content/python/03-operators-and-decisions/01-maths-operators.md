---
type: concept
title: "Arithmetic operators: +, -, *, /, //, % and **"
difficulty: easy
tags: [operators, maths, basics]
revision:
  - "In `7 + 2`, `+` is the **operator** and `7` and `2` are the **operands**"
  - "`/` always gives a `float`; `//` (**floor division**) rounds down toward negative infinity (`-7 // 2 == -4`)"
  - "`%` (**modulo**) gives the remainder and keeps `a == (a // b) * b + (a % b)` true even for negatives"
---

In any calculation like `7 + 2`, the sign (`+`) is called an **operator**, the values it works on (`7` and `2`) are called **operands**, and the whole combination (`7 + 2`) is called an **expression**.

Python has seven built-in **arithmetic operators**:

```python
print(7 + 2)       # addition -> 9
print(7 - 2)       # subtraction -> 5
print(7 * 2)       # multiplication -> 14
print(7 / 2)       # true division -> 3.5 (always a float)
print(7 // 2)      # floor division -> 3 (rounds down)
print(7 % 2)       # modulo (remainder) -> 1
print(2 ** 3)      # exponentiation (power) -> 8
print(9 ** 0.5)    # fractional power (square root) -> 3.0
```

The screen shows:

```text
9
5
14
3.5
3
1
8
3.0
```

Look closely at how **floor division** (`//`) and **modulo** (`%`) handle important **edge cases**:

- **Even division with `/`:** Even `10 / 2` gives `5.0` (a `float`), never `5`.
- **Negative floor division:** `//` rounds **down toward negative infinity**, not toward zero! So `7 // 2` is `3`, **but** `-7 // 2` is `-4` (because `-3.5` rounded down is `-4`, not `-3`).
- **Negative modulo:** `-7 % 2` gives `1`, not `-1`. Python keeps the rule `a == (a // b) * b + (a % b)`: `(-4 * 2) + 1 == -7`. And if the divisor is negative (`7 % -2`), the remainder takes the divisor's sign (`-1`).
- **Dividing by zero:** `5 / 0`, `5 // 0`, and `5 % 0` all stop immediately with `ZeroDivisionError`.
- **Float operands with `//`:** `7.5 // 2` gives `3.0` (rounded down, kept as a `float`).
