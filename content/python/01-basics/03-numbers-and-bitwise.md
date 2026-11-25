---
type: concept
title: "Numbers, literals, Decimal, and bitwise operators"
difficulty: easy
tags: [basics, numbers, bitwise]
---

Python has three built-in numeric types: `int` (arbitrary precision — never overflows!), `float` (64-bit IEEE 754), and `complex` (`3 + 4j`).

```python
big = 1_000_000_000          # underscores improve readability
binary = 0b1010              # 10 (hex: 0xFF, octal: 0o77)
exact = Decimal("0.1")       # from decimal import Decimal — exact base-10
ratio = Fraction(1, 3)       # from fractions import Fraction — exact 1/3
```

**Bitwise operators** work directly on `int` bits and show up frequently in flags, permissions, and coding interviews:

| Operator         | Meaning                | Example (`a=5 (101)`, `b=3 (011)`) |
| ---------------- | ---------------------- | ---------------------------------- |
| `&` / `\|` / `^` | AND / OR / XOR         | `a & b == 1`, `a ^ b == 6`         |
| `~`              | Bitwise NOT (`-(n+1)`) | `~5 == -6`                         |
| `<<` / `>>`      | Left / right shift     | `5 << 1 == 10`, `5 >> 1 == 2`      |

:::insight[No integer overflow]
Unlike C or Java, `10 ** 100` works natively in Python `int` because integers grow dynamically in memory.
:::
