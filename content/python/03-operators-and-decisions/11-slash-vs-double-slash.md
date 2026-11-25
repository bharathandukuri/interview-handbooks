---
type: compare
title: "/ vs //: true division vs floor division"
difficulty: easy
left: "/ (true division)"
right: "// (floor division)"
tags: [operators, maths, numbers]
related: [python.operators-and-decisions.maths-operators]
revision:
  - "`/` (**true division**) always returns a `float`, even for exact integers (`10 / 2 == 5.0`)"
  - "`//` (**floor division**) rounds **down** toward negative infinity (`7 // 2 == 3`, `-7 // 2 == -4`)"
---

Python gives you two division operators because dividing numbers can either keep the fractional remainder or discard it down to whole steps.

| Check                     | `/` (true division)      | `//` (floor division)                                                  |
| ------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `7` and `2`               | `3.5` (`float`)          | `3` (`int`)                                                            |
| `10` and `2`              | `5.0` (still a `float`!) | `5` (`int`)                                                            |
| `-7` and `2`              | `-3.5`                   | `-4` (rounds toward negative infinity, NOT `-3`)                       |
| `7.5` and `2`             | `3.75` (`float`)         | `3.0` (`float` — keeps `float` type if either side is `float`)         |
| Divide by `0`             | `ZeroDivisionError`      | `ZeroDivisionError`                                                    |
| Compared to `int(-7 / 2)` | N/A                      | `int(-3.5)` is `-3` (truncates toward zero), whereas `-7 // 2` is `-4` |

## Verdict

Use **`/`** for real-world measurements, averages, prices, and percentages. Use **`//`** when dividing into whole discrete units (pages, minutes, boxes, midpoint index `(lo + hi) // 2`). Remember the negative edge case: if you need truncation toward zero rather than floor division on negative numbers, use `int(a / b)`.
