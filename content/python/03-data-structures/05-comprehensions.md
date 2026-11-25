---
type: concept
title: "List, dict, and set comprehensions"
difficulty: easy
mostAsked: true
tags: [comprehensions, syntax, pythonic]
revision:
  - "Comprehensions build collections concisely: `[expr for x in it if cond]`"
  - "Put `if` at the end to filter; put `a if cond else b` before `for` to transform"
  - "Prefer a plain `for` loop if nesting exceeds two levels — readability wins"
---

Comprehensions replace verbose `result = []` + `.append()` loops with a declarative, faster expression.

```python
# List comprehension with filter
evens = [n * n for n in range(10) if n % 2 == 0]

# Conditional expression (if-else) goes BEFORE `for`
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]

# Dict & Set comprehensions
word_len = {w: len(w) for w in ["hi", "python"]}
unique_chars = {ch.lower() for ch in "Hello"}   # {'h', 'e', 'l', 'o'}

# Nested flattening (reads left-to-right like nested `for` loops)
matrix = [[1, 2], [3, 4]]
flat = [val for row in matrix for val in row]    # [1, 2, 3, 4]
```

:::tip[Don't abuse comprehensions for side effects]
Never write `[print(x) for x in items]` — it builds a useless list of `None`s. Use a normal `for` loop for side effects.
:::
