---
type: concept
title: "Comparing values: relational operators and chaining"
difficulty: easy
tags: [operators, comparison, booleans]
revision:
  - "The six **relational operators** (`==`, `!=`, `<`, `>`, `<=`, `>=`) always return `True` or `False`"
  - "Chained comparisons (`13 <= age <= 19`) check both conditions cleanly with `and` semantics"
  - 'Never compare a string to a number with `<` (`TypeError`); `"5" == 5` is safely `False`'
---

Programs make decisions using the six **relational (comparison) operators**. Each one returns a **boolean** (`True` or `False`).

| Operator | Meaning                  | Example              | Result  |
| -------- | ------------------------ | -------------------- | ------- |
| `==`     | Equal to                 | `5 == 5.0`           | `True`  |
| `!=`     | Not equal to             | `5 != 3`             | `True`  |
| `>`      | Greater than             | `5 > 3`              | `True`  |
| `<`      | Less than                | `"apple" < "banana"` | `True`  |
| `>=`     | Greater than or equal to | `5 >= 5`             | `True`  |
| `<=`     | Less than or equal to    | `3 <= 2`             | `False` |

```python
age = 16
print(13 <= age <= 19)    # chained comparison: (13 <= age) and (age <= 19)
print("Cat" < "ant")      # uppercase letters come before lowercase!
print(5 == 5.0)           # int and float with same value are equal
print("5" == 5)           # different types -> False (does NOT crash)
```

The screen shows:

```text
True
True
True
False
```

**Key edge cases to know:**

- **String ordering is dictionary/character-code order (ASCII/Unicode):** `"Cat" < "ant"` is `True` because all uppercase letters (`A`–`Z`) have smaller character codes than lowercase letters (`a`–`z`).
- **Mixing `str` and `int` with `<` or `>`:** `"5" == 5` returns `False`, **but** `"5" < 10` raises `TypeError` because Python refuses to guess whether `"5"` should be ordered as text or a number.
- **`True == 1` and `False == 0`:** Because `bool` is a special kind of `int`, `True == 1` and `False == 0` are `True`.
