---
type: pitfall
title: "Case sensitivity, mismatched quotes, and missing brackets"
difficulty: easy
mostAsked: true
tags: [syntax, errors, basics, gotchas]
related:
  [
    python.getting-started.reading-error-messages,
    python.getting-started.print-basics,
  ]
revision:
  - "Python is **case-sensitive**: `Print('hi')` causes a **`NameError`** because the built-in function is lowercase `print`"
  - 'Unclosed quotes (`"hello''`) or missing `)` trigger a **`SyntaxError`** — often reported on the **next** line!'
---

## The trap

```python
# Beginner bug 1: Capital `P` instead of lowercase `print`:
# Print("Hello")              # NameError: name 'Print' is not defined

# Beginner bug 2: Unclosed bracket `(`, Python blames the NEXT line!
# print("Welcome"
# print("Done")               # SyntaxError: '(' was never closed (points at line 1 or 2!)

# Beginner bug 3: Apostrophe breaks single-quoted string:
# print('It's fine')          # SyntaxError: unterminated string literal
```

## The fix

```python
print("Hello")                  # lowercase `print`
print("Welcome")                # matching closing `)`
print("Done")
print("It's fine")              # double quotes safely wrap apostrophes `'`!
print('She said "Hello!"')      # single quotes safely wrap inner double quotes `"`!
```

## Why it happens

1. **Case sensitivity:** Python treats lowercase and uppercase letters as completely different symbols. `print` exists built in; `Print` and `PRINT` do not!
2. **Bracket & quote matching:** Every opening `(`, `"`, or `'` expects an identical closing partner. If an apostrophe inside `'It's fine'` closes the string early, Python tries to read `s fine'` as broken keywords and stops with **`SyntaxError`**. When Python blames line 2 for a syntax mistake, always glance upward at line 1!
