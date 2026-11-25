---
type: concept
title: "Associativity: breaking ties at the same precedence"
difficulty: easy
mostAsked: true
tags: [operators, associativity, precedence]
related: [python.operators-and-decisions.operator-precedence]
revision:
  - "**Associativity** breaks ties when adjacent operators share the **exact same precedence level**"
  - "Most operators (`-`, `/`, `//`, `%`, `&`, `and`, `or`) associate **left to right**"
  - "**`**` (power), unary signs, ternary `if-else`, and assignments associate **right to left**"
---

Precedence decides between **different** levels (`*` beats `+`). **Associativity** breaks ties when two operators sit on the **exact same level** next to each other, such as `10 - 3 - 2` or `2 ** 3 ** 2`.

```python
print(10 - 3 - 2)        # left to right: (10 - 3) - 2 = 5
print(24 / 4 / 2)        # left to right: (24 / 4) / 2 = 3.0
print(2 ** 3 ** 2)       # RIGHT to left: 2 ** (3 ** 2) = 512
print(-3 ** 2)           # unary `-` is BELOW `**`: -(3 ** 2) = -9
print(1 < 5 < 10)        # comparison chaining: (1 < 5) and (5 < 10)
```

The screen shows:

```text
5
3.0
512
-9
True
```

Understanding the four tricky **associativity edge cases** prevents subtle bugs:

1. **Subtraction and division go left to right:** `24 / 4 / 2` computes `24 / 4` (`6.0`) first, then `6.0 / 2` (`3.0`) — **never** `24 / (4 / 2)` (`12.0`).
2. **`**` goes right to left:** `2 ** 3 ** 2` computes `3 ** 2` (`9`) first, then `2 ** 9` (`512`) — **never** `(2 ** 3) ** 2` (`64`).
3. **Unary `-` vs `**`:** `**` has higher precedence than unary `-`, **except** on its right operand! So `-3 ** 2` parses as `-(3 ** 2)` = `-9`, while `2 ** -1` parses as `2 ** (-1)` = `0.5`! Always write `(-3) ** 2` if you mean squaring `-3`.
4. **Comparisons are chained, not grouped left to right:** `1 < 5 < 10` does **not** become `(1 < 5) < 10` (`True < 10`). Python expands it into `(1 < 5) and (5 < 10)` and evaluates the middle operand (`5`) only once!
