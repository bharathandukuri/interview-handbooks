---
type: concept
title: "Escape sequences and raw strings (\\n, \\t, \\\\, r\"...\")"
difficulty: easy
mostAsked: true
tags: [strings, escape-sequences, raw-strings, basics]
revision:
  - "A backslash (`\\`) is the **escape character**; pairs like `\\n` and `\\t` are **escape sequences**"
  - "Use `\\\\` to print one literal backslash, or prefix quotes with `r\"...\"` (**raw string**)"
  - "**Edge case:** even a raw string cannot end with a single trailing backslash like `r\"C:\\\"`"
---

How do you put a newline, tab, quote mark, or backslash **inside** a string?

Python uses the backslash (`\`) as the **escape character**. A backslash followed by a special character forms an **escape sequence** — two typed characters that represent **one** special character inside the string:

| Escape sequence | What it produces                     | Length (`len`) |
| --------------- | ------------------------------------ | -------------- |
| `\n`            | New line                             | `1`            |
| `\t`            | Tab space                            | `1`            |
| `\'` / `\"`     | Literal quote inside matching quotes | `1`            |
| `\\`            | One literal backslash `\`            | `1`            |

```python
print("Line 1\nLine 2")         # \n splits onto two lines
print("Name\tScore")           # \t inserts a tab
print("She said \"Hi!\"")      # \" stays inside double quotes
print("C:\\new\\notes.txt")    # \\ becomes one literal \
print(r"C:\new\notes.txt")     # raw string: \n is NOT treated as newline!
print(len("\n"))               # 1 character, even though typed as 2 symbols!
```

The screen shows:

```text
Line 1
Line 2
Name	Score
She said "Hi!"
C:\new\notes.txt
C:\new\notes.txt
1
```

**Raw strings (`r"..."`) and their famous edge case:**

- Writing `print("C:\new")` accidentally reads `\n` as a newline and prints `C:` followed by `ew` on the next line! Putting `r` before quotes makes a **raw string**, telling Python to keep every backslash literal — ideal for Windows paths and regular expressions (Chapter 11).
- **Trailing backslash edge case:** A raw string **cannot end with an odd number of backslashes** (`r"C:\folder\"` raises `SyntaxError`) because Python still treats `\"` as an escaped quote while scanning where the string ends! Write `r"C:\folder" + "\\"` instead.
