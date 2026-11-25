---
type: concept
title: "Booleans: True, False, and the bool-is-an-int quirk"
difficulty: easy
tags: [booleans, types, comparisons, basics]
revision:
  - "A **boolean (`bool`)** represents truth values and has exactly two literals: **`True`** and **`False`** (case-sensitive!)"
  - "`=` assigns a variable; `==` compares two values and returns a `bool`"
  - "In Python, `bool` inherits from `int`: **`True == 1`** and **`False == 0`** (watch out when counting or checking `isinstance(True, int)`!)"
---

A **boolean** (`bool`, named after mathematician George Boole) holds logical yes/no truth values. There are only **two** boolean literals in Python: **`True`** and **`False`** (always capitalized!).

Comparisons (`>`, `<`, `==`, `!=`) automatically evaluate to a `bool`:

```python
is_student = True
has_pet = False
print("Values:", is_student, has_pet)
print("5 > 3?", 5 > 3, "| 5 == 3?", 5 == 3)

# Subtle Python quirk: bool is a subclass of int (`True == 1`, `False == 0`)!
print("True == 1?", True == 1, "| False == 0?", False == 0)
print("True + True:", True + True)
```

The screen shows:

```text
Values: True False
5 > 3? True | 5 == 3? False
True == 1? True | False == 0? True
True + True: 2
```

**Important edge cases and common traps:**

- **Capitalization (`true` vs `True`):** Writing lowercase `true` or `false` raises **`NameError`** (unless you accidentally named a variable `true` — don't!).
- **`=` vs `==`:** One equals sign **`=`** saves a value into a variable (`x = 5`); two equals signs **`==`** ask _"are these two equal?"_ (`x == 5` -> `True` or `False`).
- **Why `True == 1` & `False == 0` matters later:** Because `bool` inherits from `int`, Python allows `True + True == 2` (sometimes handy for counting matches like `sum(x > 0 for x in nums)`!), **but** it creates real gotchas too: `{1, True}` in a set has length `1`, and `isinstance(True, int)` evaluates to **`True`**!
- **Next chapters:** Chapter 03 covers `and` / `or` / `not` plus **truthy & falsy** values (`bool(0)` vs `bool("False")`) in full!
