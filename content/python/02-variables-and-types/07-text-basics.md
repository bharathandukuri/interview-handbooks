---
type: concept
title: "Strings (str): quotes, joining (+), repeating (*), len(), and edge cases"
difficulty: easy
tags: [strings, text, unicode, basics]
revision:
  - 'A **string (`str`)** is a sequence of **Unicode characters** inside `''...''`, `"..."`, or `"""..."""`'
  - "Empty string `''` has `len('') == 0`; spaces inside quotes still count toward `len()`"
  - "`+` joins two strings; `s * n` repeats text (`n <= 0` gives `''`); mixing `str + int` raises `TypeError`"
---

Text in Python is stored as a **string** (type **`str`**) — a sequence of **Unicode characters** (supporting English letters, spaces, punctuation, accented letters `"café"`, `"₹"`, and emojis `"🚀"` natively!).

Strings can use single quotes `'...'`, double quotes `"..."`, or triple quotes `"""..."""` (for multi-line text):

```python
first = "Ada"
last = "Lovelace"
full = first + " " + last          # concatenation with `+`
print("Full:", full, "| length:", len(full))

empty = ""                         # empty string (valid string with 0 characters!)
print("empty len:", len(empty), "| repeat 0 times:", repr("ha" * 0))
print("laugh:", "ha" * 3)
print("Line 1\nLine 2")            # `\n` is an escape sequence meaning newline!
```

The screen shows:

```text
Full: Ada Lovelace | length: 12
empty len: 0 | repeat 0 times: ''
laugh: hahaha
Line 1
Line 2
```

**Key operations and edge cases:**

- **`len(text)` counts EVERY character:** Spaces, digits, punctuation, and invisible newline `\n` characters all add `1` to `len()` (`len("Ada Lovelace")` is `3 + 1 + 8 = 12`). Even `""` (empty quotes) is a valid string of length `0`!
- **`*` repetition rules:** `"ha" * 3` produces `"hahaha"` (and `3 * "ha"` works identically). Multiplying by `0` or a negative integer (`"ha" * -2`) returns an **empty string `""`** without crashing — whereas multiplying by a float (`"ha" * 2.5`) or string (`"ha" * "2"`) raises **`TypeError`**.
- **Strings and numbers never auto-mix (`TypeError`):** Writing `"Age: " + 20` fails with **`TypeError: can only concatenate str (not "int") to str`** — convert numbers with `str(20)` first (covered in card `12`), or pass comma-separated args to `print("Age:", 20)`, or use f-strings in Chapter 04!
- **Special characters (`\n`, `\t`, `\"`):** A backslash `\` starts an **escape sequence** — for example `\n` starts a new line (we cover all escape sequences and raw strings `r"..."` cleanly in Chapter 04!).
