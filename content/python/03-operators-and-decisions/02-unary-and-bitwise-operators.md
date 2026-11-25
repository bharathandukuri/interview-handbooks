---
type: concept
title: "Unary signs and bitwise operators"
difficulty: easy
tags: [operators, unary, bitwise]
related: [python.operators-and-decisions.maths-operators]
revision:
  - "**Binary operators** take two operands (`5 + 3`); **unary operators** take one operand (`-x`, `+x`, `~x`)"
  - "Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) work on each binary bit (`0` or `1`) of whole numbers"
  - "`~x` equals `-(x + 1)` due to two's complement binary representation"
---

Most operators (`+`, `-`, `*`) are **binary operators** because they work on **two operands** (`5 + 3`). Python also has **unary operators** that sit in front of **one operand** (`-x`, `+x`, `~x`), plus **bitwise operators** that act directly on the binary bits (`0`s and `1`s) inside integers (`int`).

```python
x = 5              # binary: 101 (4 + 0 + 1)
print(-x, +x)      # unary minus flips sign; unary plus keeps sign
print(5 & 3)       # 101 & 011 = 001 (AND: 1 only if both bits are 1)
print(5 | 3)       # 101 | 011 = 111 (OR:  1 if either bit is 1)
print(5 ^ 3)       # 101 ^ 011 = 110 (XOR: 1 if bits are different)
print(~5)          # bitwise NOT: -(5 + 1) = -6
print(5 << 1)      # left shift by 1: 101 becomes 1010 (10)
print(5 >> 1)      # right shift by 1: 101 becomes 10 (2)
```

The screen shows:

```text
-5 5
1
7
6
-6
10
2
```

Here is why every line turns out that way:

- **Bit-by-bit (`5` is `101`, `3` is `011`):**
  - `&` (**AND**) keeps `1` only where both bits are `1` -> `001` (`1`).
  - `|` (**OR**) puts `1` where at least one bit is `1` -> `111` (`7`).
  - `^` (**XOR**, exclusive OR) puts `1` only where the two bits differ -> `110` (`6`).
- **Bitwise NOT (`~`):** Computers store negative ints using **two's complement**, so flipping every bit gives `~x == -(x + 1)` (`~5 == -6`, `~-1 == 0`).
- **Bit shifts:** `x << n` pushes bits left `n` slots (same as multiplying by `2 ** n`); `x >> n` pushes bits right `n` slots (same as floor-dividing by `2 ** n`).

:::pitfall[Edge cases for bitwise operators]
Bitwise operators work **only on `int`** (and `bool`), never on `float` (`5.0 & 3` raises `TypeError`). Shifting by a negative count (`5 << -1`) raises `ValueError: negative shift count`.
:::
