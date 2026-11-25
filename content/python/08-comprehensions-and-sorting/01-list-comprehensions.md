---
type: concept
title: "List comprehensions: build lists in one clear line"
difficulty: easy
mostAsked: true
tags: [comprehensions, lists, pythonic]
related:
  [python.lists-and-tuples.what-is-a-list, python.loops.for-loop-and-strings]
revision:
  - "Syntax: `[expression for item in iterable if condition]`"
  - "Put `if` at the **end** to filter items; put `a if cond else b` **before `for`** to transform every item"
  - "In Python 3, the loop variable stays inside the comprehension and never overwrites outer variables"
---

Building a list by starting with `result = []` and calling `.append()` inside a `for` loop is so common that Python gives it a clean, faster syntax called a **list comprehension**.

```python
nums = [1, 2, 3, 4, 5, 6]

squares = [n * n for n in nums]                        # transform every item
evens = [n for n in nums if n % 2 == 0]                # filter (`if` at the end!)
labels = ["even" if n % 2 == 0 else "odd" for n in nums[:4]]   # ternary BEFORE `for`!

print(squares)
print(evens)
print(labels)
```

The screen shows:

```text
[1, 4, 9, 16, 25, 36]
[2, 4, 6]
['odd', 'even', 'odd', 'even']
```

**Why comprehensions beat verbose `.append()` loops (and key rules):**

1. **Filter vs Transform:** An `if` at the **right** filters items out (smaller or equal list). An `a if cond else b` **ternary expression** at the **left** transforms every single item (same list length!).
2. **Scope isolation (edge case):** In Python 3, `[x * 2 for x in range(3)]` runs in its own scope, so if you already had `x = 100`, `x` safely stays `100`!
3. **Speed:** List comprehensions avoid repeated Python `.append()` method lookups, running slightly faster than manual loops.
