---
type: pitfall
title: ".strip('abc') vs .removeprefix('abc') / .removesuffix('abc')"
difficulty: medium
tags: [strings, methods, pitfalls, edge-cases]
related: [python.strings.case-and-strip-methods]
revision:
  - "`.strip(chars)` treats its argument as a **set of individual characters**, not a whole prefix/suffix string"
  - "Use `.removeprefix()` / `.removesuffix()` (Python 3.9+) to remove an exact prefix or suffix safely"
---

## The trap

```python
filename = "notes.py"
print(filename.rstrip(".py"))
# Prints: notes

name = "happy.py"
print(name.rstrip(".py"))
# Prints: ha   <-- NOT happy! It ate the trailing 'p' and 'y' too!
```

## The fix

```python
print("notes.py".removesuffix(".py"))     # notes
print("happy.py".removesuffix(".py"))     # happy
print("www.example.com".removeprefix("www."))  # example.com
```

## Why it happens

`.strip(chars)`, `.lstrip(chars)`, and `.rstrip(chars)` do **not** match an exact phrase! Python stops at the end and keeps deleting characters one by one as long as each character appears _anywhere_ inside `".py"` (`'.'`, `'p'`, or `'y'`). In `"happy.py"`, after removing `".py"`, the next character from the right is `'p'` and then `'p'` again — both inside `".py"`, so it deletes `"pp"` too!

Python 3.9 added **`.removeprefix(prefix)`** and **`.removesuffix(suffix)`**, which remove at most one **exact** whole substring cleanly (or return the string unchanged if it does not match).
