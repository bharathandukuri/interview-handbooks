---
type: concept
title: "Customize print() output with sep and end"
difficulty: easy
tags: [print, arguments, basics]
revision:
  - "`sep` controls what separates multiple arguments (default `' '` — a single space)"
  - "`end` controls what prints at the very end (default `'\\n'` — a newline)"
  - "`sep` only appears **between** items, so passing 0 or 1 item does not print `sep`"
---

By default, **`print()`** uses two hidden **keyword arguments** (named options with built-in default values):

- **`sep=" "` (separator):** what Python places **between** two or more comma-separated arguments (default is one space).
- **`end="\n"` (ending):** what Python appends **after the last argument** (default `\n` moves to a new line — `\n` is an **escape sequence** meaning "newline", covered in full in Chapter 04).

```python
print("25", "11", "2026", sep="-")       # dashes between items
print("No", "gaps", "here", sep="")      # empty string removes all spaces!
print("OnlyOne", sep="-")                # 1 item -> sep is NEVER added!

print("Loading", end="...")              # stays on the SAME line
print("done!")                           # picks up right after "..."

print("Line", end=" | ")                 # ends with " | " instead of newline
print("Next")
```

The screen shows:

```text
25-11-2026
Nogapshere
OnlyOne
Loading...done!
Line | Next
```

**Important details and edge cases:**

- **Order rule (`*args` before keyword options):** Keyword options like `sep="-"` and `end=""` must always go **after** the items you want to print (`print(sep="-", "a", "b")` causes a `SyntaxError`!).
- **Single-item `sep` surprise:** `print("OnlyOne", sep="-")` prints `OnlyOne` without any dashes, because `sep` goes _between_ adjacent arguments — with only one item there is no gap to fill!
- **`sep=None` / `end=None`:** Passing `None` tells `print()` to fall back to the default space / newline.
- **No newline when using `end=""`:** Calling `print("Hi", end="")` prints `"Hi"` without moving down a line — remember to call `print()` later if you want to return to a fresh line!
