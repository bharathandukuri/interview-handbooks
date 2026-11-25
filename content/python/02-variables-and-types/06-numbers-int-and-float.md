---
type: concept
title: "Numbers: int, float, and division edge cases"
difficulty: easy
tags: [numbers, int, float, basics]
revision:
  - "**`int`** stores exact whole numbers of arbitrary size (Python integers NEVER overflow!)"
  - "**`float`** stores decimal numbers (scientific notation like `1.5e3` is also a `float`)"
  - "Dividing two `int`s with `/` **always** returns a **`float`** (`10 / 2` is `5.0`, not `5`!)"
---

Python has two primary numeric types for everyday math:

1. **`int` (integer):** Exact whole numbers (`12`, `0`, `-45`, `1_000_000`). Use underscores `_` inside long numbers (`1_000_000` equals `1000000`) to keep zeroes readable!
2. **`float` (floating-point number):** Numbers containing a decimal point or exponent (`9.99`, `-0.5`, `7.0`, `1.5e3` which means $1.5 \times 10^3 = 1500.0$).

```python
apples = 12
price = 9.99
million = 1_000_000
print(apples + 3, "|", price * 2, "|", million)

# Arbitrary-precision ints never overflow:
print("Huge int:", 99999999999 * 99999999999)

# Edge case 1: `/` ALWAYS returns a float even when evenly divisible!
print("10 / 2 ->", 10 / 2, "| 1.5e3 ->", 1.5e3)

# Edge case 2: mixing int + float produces a float:
print("5 + 2.0 ->", 5 + 2.0)
```

The screen shows:

```text
15 | 19.98 | 1000000
Huge int: 9999999999800000000001
10 / 2 -> 5.0 | 1.5e3 -> 1500.0
5 + 2.0 -> 7.0
```

**Important edge cases with Python numbers:**

- **No integer overflow (unlike C/Java):** C 32-bit ints wrap silently past `2,147,483,647`! Python `int` grows dynamically to any size your RAM holds (`10**100` works natively!).
- **Division `/` always produces a `float`:** Even `10 / 2` gives **`5.0`**, never `5`! Use floor division `10 // 2` (covered in Chapter 03) when you want an integer quotient (`5`).
- **`float` range & special values (`inf`, `nan`):** Unlike `int`, `float` uses fixed 64-bit IEEE 754 precision (around 15–17 decimal digits cleanly). You can also represent infinity (`float("inf")`, `float("-inf")`) and "Not a Number" (`float("nan")`, where weirdly `nan == nan` is `False`!). Also note leading zeroes on decimal numbers like `07` are illegal (`SyntaxError`) — except `0` itself or `0.7`!
