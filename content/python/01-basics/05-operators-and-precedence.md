---
type: concept
title: "Operators, precedence, short-circuiting, and walrus `:=`"
difficulty: easy
tags: [basics, operators, syntax]
---

Know the core operator distinctions that trip up beginners:

```python
print(7 / 2)      # 3.5  (true division — always returns float)
print(7 // 2)     # 3    (floor division — rounds toward -infinity: -7 // 2 == -4)
print(7 % 2)      # 1    (modulo / remainder)
print(2 ** 10)    # 1024 (exponentiation)
```

**Chained comparisons & short-circuiting:**

- Python lets you chain comparisons cleanly: `0 <= score <= 100` means `(0 <= score) and (score <= 100)`.
- `and` and `or` **short-circuit** and return one of the actual operands, not necessarily a `bool`: `name = user_input or "Guest"`.

**Walrus operator (`:=`, Python 3.8+):** Assigns and returns a value inside an expression:

```python
if (n := len(items)) > 10:
    print(f"Too many items ({n})")
```

**Precedence order (high → low):** `()` → `**` → unary `+`/`-`/`~` → `*`/`/`/`//`/`%` → `+`/`-` → comparisons/`is`/`in` → `not` → `and` → `or` → `:=`. When in doubt, use parentheses.
