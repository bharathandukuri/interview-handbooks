---
type: concept
title: "String methods: changing case and stripping whitespace"
difficulty: easy
tags: [strings, methods, basics]
related: [python.strings.strings-never-change]
revision:
  - "A **method** is a function attached to a value with `.` (`word.lower()`); standalone tools like `len(word)` are **functions**"
  - "`.strip()` removes **whitespace** (`' '`, `\\t`, `\\n`) from **both ends** — never from the middle"
  - "**Method chaining** runs left to right: `name.strip().title()`"
---

Tools like `len(s)` are standalone **functions**. Tools attached to a string with a dot (`.`) — like `s.lower()` — are called **methods**. Because strings are immutable, every string method returns a **brand-new string**.

```python
raw = " \t aSha rAo \n"
print(repr(raw.strip()))              # removes spaces, \t, \n at both ends
print(raw.strip().lower())            # method chaining: runs left to right
print(raw.strip().upper())
print(raw.strip().title())            # capitalizes each word
print("hello world".capitalize())     # only first char of whole string
```

The screen shows:

```text
'aSha rAo'
asha rao
ASHA RAO
Asha Rao
Hello world
```

**Important details and edge cases:**

- **What is whitespace?** Not only spaces `" "` — `.strip()`, `.lstrip()` (left only), and `.rstrip()` (right only) remove spaces, tabs (`\t`), and newlines (`\n`) from the edges, leaving interior spaces (`"aSha rAo"`) intact.
- **`.strip(chars)` gotcha:** Passing characters like `"xyxabcy".strip("xy")` removes _any_ leading/trailing `'x'` or `'y'` characters in any order (`"abc"`), NOT the exact phrase `"xy"`! Use `.removeprefix()` / `.removesuffix()` (Python 3.9+) for exact prefixes/suffixes.
- **Case comparison:** Always normalize user input with `.strip().lower()` before comparing (`if ans.strip().lower() == "yes":`).
