---
type: concept
title: "Naming variables: rules, keywords, and clean conventions"
difficulty: easy
tags: [variables, naming, pep8, basics]
revision:
  - "**Identifiers** (variable names) may contain letters, digits, and `_`, and cannot start with a digit"
  - "Names are **case-sensitive** (`age` != `Age`) and cannot match Python **reserved keywords** (`if`, `for`, `class`, `True`)"
  - "Use `snake_case` for variables, `UPPER_CASE` for constants, and NEVER shadow built-in names like `str`, `int`, or `print`!"
---

Names you pick for variables, functions, and classes are called **identifiers**. Python enforces strict grammar rules on every identifier, plus team readability conventions (**PEP 8**):

**Hard Python rules (breaking them raises `SyntaxError`):**

1. Allowed characters: letters (`a-z`, `A-Z` — Python 3 also allows Unicode letters cleanly), digits (`0-9`), and underscores (`_`).
2. **Cannot start with a digit:** `player2` is fine; `2nd_player` raises `SyntaxError`.
3. **No spaces, hyphens `-`, or `@`/`$` symbols:** `user-age` reads to Python as `user minus age`!
4. **Cannot use Python's reserved keywords:** words that Python reserves for its grammar (`if`, `else`, `for`, `while`, `def`, `class`, `return`, `import`, `True`, `False`, `None`, `and`, `or`, `not`, `in`, `is`).
5. **Case-sensitive:** `score`, `Score`, and `SCORE` are three completely separate variables!

| Name          | Valid? | Notes                                                  |
| ------------- | ------ | ------------------------------------------------------ |
| `total_price` | ✅ Yes | Descriptive `snake_case` (recommended!)                |
| `score2`      | ✅ Yes | Digits anywhere after character 1                      |
| `_temp`       | ✅ Yes | Leading `_` conventionally signals internal/helper use |
| `2nd_place`   | ❌ No  | Starts with a digit -> `SyntaxError`                   |
| `my-name`     | ❌ No  | Hyphen `-` means subtraction -> `SyntaxError`          |
| `class`       | ❌ No  | Reserved keyword -> `SyntaxError`                      |

**Two subtle traps beginners hit:**

- **Never overwrite built-in function/type names:** Python _lets_ you write `print = "oops"` or `str = 10` without a `SyntaxError` because `print` and `str` are built-in names, **not** reserved keywords! Yet the next time you write `print("hi")`, Python crashes with **`TypeError: 'str' object is not callable`**! Never name variables `print`, `input`, `str`, `int`, `list`, `dict`, or `type`.
- **Naming conventions:** write variables in lowercase **`snake_case`** (`total_price`, not cryptic `tp`), write fixed module settings in **`UPPER_SNAKE_CASE`** (`MAX_RETRIES = 3` — Python still allows changing constants, so capitals tell humans "do not modify!"), and use single **`_`** for throwaway values you intentionally ignore (`a, _ = 10, 20`).
