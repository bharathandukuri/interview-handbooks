---
type: concept
title: "Complete operator precedence: highest to lowest"
difficulty: easy
mostAsked: true
tags: [operators, precedence, rules]
related:
  [
    python.operators-and-decisions.maths-operators,
    python.operators-and-decisions.unary-and-bitwise-operators,
  ]
revision:
  - "Every Python operator sits at a fixed **precedence** level from `()` (highest) down to `:=` (lowest)"
  - "Arithmetic finishes before comparisons (`==`, `<`), which finish before logical operators (`not`, `and`, `or`)"
  - "Even unary `-` sits **below** `**`, so `-3 ** 2` means `-(3 ** 2) == -9`"
---

When one line contains several operators, **operator precedence** tells Python which operator binds tightest and runs **first**. Below is Python's complete official precedence table from **highest** (1) to **lowest** (18):

| Order | Operators                                                        | Meaning                                 | Associativity           |
| ----- | ---------------------------------------------------------------- | --------------------------------------- | ----------------------- |
| 1     | `( ... )`                                                        | Brackets / grouping                     | Inner first             |
| 2     | `x[i]`, `x[a:b]`, `f()`, `x.a`                                   | Indexing, slicing, calls, attributes    | Left to right           |
| 3     | `await x`                                                        | Async wait (Chapter 15)                 | Right to left           |
| 4     | `**`                                                             | Exponentiation (power)                  | Right to left           |
| 5     | `+x`, `-x`, `~x`                                                 | Unary plus, minus, bitwise NOT          | Right to left           |
| 6     | `*`, `@`, `/`, `//`, `%`                                         | Multiply, `@`, divide, floor, remainder | Left to right           |
| 7     | `+`, `-`                                                         | Addition, subtraction                   | Left to right           |
| 8     | `<<`, `>>`                                                       | Bit shifts left and right               | Left to right           |
| 9     | `&`                                                              | Bitwise AND                             | Left to right           |
| 10    | `^`                                                              | Bitwise XOR                             | Left to right           |
| 11    | `\|`                                                             | Bitwise OR                              | Left to right           |
| 12    | `==`, `!=`, `<`, `<=`, `>`, `>=`, `is`, `is not`, `in`, `not in` | Comparisons, identity, membership       | Chained (left to right) |
| 13    | `not`                                                            | Logical NOT                             | Right to left           |
| 14    | `and`                                                            | Logical AND                             | Left to right           |
| 15    | `or`                                                             | Logical OR                              | Left to right           |
| 16    | `a if c else b`                                                  | Conditional (ternary) expression        | Right to left           |
| 17    | `lambda`                                                         | Anonymous function (Chapter 9)          | Right to left           |
| 18    | `:=`                                                             | Walrus assignment expression            | Right to left           |

Watch how Python simplifies a mixed expression tier by tier from highest to lowest:

```python
print(2 + 3 * 2 ** 2 > 10 and not False)
```

1. Tier 4 (`**`): `2 ** 2` -> `4` (`2 + 3 * 4 > 10 and not False`)
2. Tier 6 (`*`): `3 * 4` -> `12` (`2 + 12 > 10 and not False`)
3. Tier 7 (`+`): `2 + 12` -> `14` (`14 > 10 and not False`)
4. Tier 12 (`>`): `14 > 10` -> `True` (`True and not False`)
5. Tier 13 (`not`): `not False` -> `True` (`True and True`)
6. Tier 14 (`and`): `True and True` -> **`True`**

:::tip[Brackets clarify complex lines]
Some operators in this table (`[]`, `@`, `in`, `lambda`, `await`, `:=`) belong to later chapters and are included here so your reference is 100% complete. Notice also that assignment statements (`=`, `+=`) are not expression operators — Python always computes the right expression first before saving. When unsure, wrap sub-expressions in `()`.
:::
