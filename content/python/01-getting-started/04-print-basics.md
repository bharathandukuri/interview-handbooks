---
type: concept
title: "print(): show output on the screen and string quote rules"
difficulty: easy
tags: [print, strings, basics]
revision:
  - "`print()` is a built-in **function**; values placed inside `(...)` are called **arguments**"
  - 'Text (**strings**) needs quotes (`''...''` or `"..."`); bare numbers do not'
  - "Passing multiple comma-separated arguments inserts one space between them and ends with a newline"
---

In Python, a **function** is a named built-in tool that performs a task. **`print`** is your first function — adding parentheses **`()`** **calls** (runs) it, and any values placed inside the parentheses are called **arguments**.

```python
print("Hello")                  # string literal inside double quotes
print('World')                  # single quotes work identically!
print(42)                       # numbers do not use quotes
print("Age:", 20, "Score:", 9.5)  # multiple arguments separated by commas
print()                         # empty print() outputs a blank line!
print("""Line one
Line two""")                    # triple quotes allow multi-line text!
```

The screen shows:

```text
Hello
World
42
Age: 20 Score: 9.5

Line one
Line two
```

**Key rules and edge cases:**

- **Commas vs numbers:** When you pass comma-separated items (`"Age:", 20`), `print()` converts numbers automatically and puts **one space** between each argument, then finishes with a **newline** (moves the cursor to the next line).
- **Single vs double quotes when apostrophes appear:** If your text already contains a single quote (`'`), wrap the string in double quotes (`"It's sunny"`); if it contains double quotes, wrap it in single quotes (`'He said "Go!"'`)! Mixing quotes (`"Hello'`) triggers a `SyntaxError`.
- **Forgetting `()`:** Typing `print "Hello"` (no parentheses) was valid only in Python 2 and fails in Python 3; typing `print` by itself without `"..."` does not run `print` at all!
- **Note on `"42"` vs `42`:** `42` is a number you can add (`42 + 1 -> 43`), whereas `"42"` in quotes is plain text (`str`)!
