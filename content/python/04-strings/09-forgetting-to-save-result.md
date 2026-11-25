---
type: pitfall
title: "Calling a string method without saving its return value"
difficulty: easy
tags: [strings, methods, gotchas]
related:
  [python.strings.case-and-strip-methods, python.strings.strings-never-change]
revision:
  - "String methods return a new string and leave the original variable untouched"
  - "Assign the result back (`name = name.strip()`) or pass it directly"
---

## The trap

```python
name = "  Asha  "
name.strip()
name.upper()
print(len(name), name)
# Shows: 8   Asha   (spaces and lowercase unchanged!)
```

## The fix

```python
name = "  Asha  "
name = name.strip().upper()
print(len(name), name)
# Shows: 4 ASHA
```

## Why it happens

Because strings are **immutable**, methods like `.strip()`, `.upper()`, and `.replace()` can never modify `name` in place. Calling `name.strip()` on a line by itself builds `"Asha"` in memory and then discards it immediately!

Reassigning `name = name.strip()` captures the new string. You can chain methods together (`name.strip().upper()`) so each step hands its new string straight to the next method.
