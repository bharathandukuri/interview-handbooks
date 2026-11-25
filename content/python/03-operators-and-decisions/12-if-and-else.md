---
type: concept
title: "if, else and nested decisions: controlling flow"
difficulty: easy
tags: [decisions, if, indentation, control-flow]
related: [python.getting-started.indentation]
revision:
  - "**Control flow** is the order Python executes lines; **conditional statements** let code branch"
  - "`if` runs its indented **code block** only when its condition is `True`; `else` handles `False`"
  - "You can place an `if` inside another `if` (**nesting**) using 8 spaces"
---

Normally Python runs lines from top to bottom. Changing which lines run based on a test is called **control flow**, and `if` / `else` is Python's fundamental **conditional statement**.

```python
age = 20
has_ticket = True

if age >= 18:
    print("Age check passed.")
    if has_ticket:
        print("Welcome to the concert!")   # 8 spaces: nested inside outer `if`
    else:
        print("Please buy a ticket first.")
else:
    print("Sorry, 18+ only.")

print("Check complete.")   # back at 0 spaces -> runs every time!
```

The screen shows:

```text
Age check passed.
Welcome to the concert!
Check complete.
```

Every `if` and `else` header ends with a **colon (`:`)**, and all lines belonging to that **code block (suite)** must share the exact same **indentation** (4 spaces for the first level, 8 spaces for a **nested `if`** inside it).

**Edge cases and common errors:**

- Missing `:` at the end of `if age >= 18` -> `SyntaxError: expected ':'`.
- Inconsistent spaces inside the same block -> `IndentationError`.
- Empty block (writing `if ready:` with no code underneath) -> `IndentationError` (use `pass` as a temporary placeholder if needed).
- Notice `print("Check complete.")` is **unindented** (back at column 0), so it always runs after the `if/else` finishes.
