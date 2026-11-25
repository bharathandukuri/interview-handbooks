---
type: concept
title: "Syntax errors vs runtime exceptions and reading tracebacks"
difficulty: easy
tags: [errors, exceptions, debugging, basics]
revision:
  - "**Syntax errors** break Python's grammar rules and stop the program **before** any line runs"
  - "**Exceptions** occur during execution on valid syntax (`ValueError`, `TypeError`, `KeyError`, `ZeroDivisionError`)"
  - "Read a **traceback** from bottom to top: the last line shows the error type and message"
---

Even well-written programs encounter unexpected inputs — a missing file, a user typing `"abc"` instead of `"42"`, or dividing by zero. Python classifies problems into two completely different categories:

1. **Syntax errors (`SyntaxError`, `IndentationError`):** Python reads your entire file first and checks its grammar **before executing line 1**. If you forget a colon `:`, leave a bracket unclosed, or mix up indentation, _nothing_ runs at all — and `try`/`except` cannot catch syntax errors in the same file.
2. **Runtime exceptions:** The code grammar is valid, so the program starts running, **but** hits an impossible operation on a specific line (`10 / 0`, `int("abc")`, `missing_file`). Without handling, Python stops and prints a **traceback**.

```python
def parse_age(text):
    return int(text)

# Runtime exception example (we catch it cleanly here so the script continues):
for sample in ["25", "twenty"]:
    try:
        print("Parsed:", parse_age(sample))
    except ValueError as err:
        print("Caught ValueError:", err)
```

The screen shows:

```text
Parsed: 25
Caught ValueError: invalid literal for int() with base 10: 'twenty'
```

**Common built-in exceptions you will see every week:**

| Exception           | When Python raises it                                    |
| ------------------- | -------------------------------------------------------- |
| `ValueError`        | Right type, wrong value (`int("abc")`, negative sqrt)    |
| `TypeError`         | Wrong type (`"age: " + 5`, `len(42)`)                    |
| `KeyError`          | Missing key in a `dict` (`user["email"]`)                |
| `IndexError`        | List or tuple index out of bounds (`nums[99]`)           |
| `AttributeError`    | Object lacks that attribute/method (`(1, 2).append(3)`)  |
| `ZeroDivisionError` | Dividing or modulo by `0` or `0.0`                       |
| `FileNotFoundError` | Trying to open a file path that does not exist           |
| `NameError`         | Using a variable name that has not been defined in scope |

**How to read a traceback without panicking:** always jump straight to the **bottom line** first — it names the exact exception class and reason. Then look one or two lines _up_ at `"File ..., line ..."` to see where your own code called the failing step (**call stack**, oldest call at the top, newest failing line at the bottom).
