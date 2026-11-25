---
type: concept
title: "First-class functions, `lambda`, and functional helpers"
difficulty: easy
tags: [functions, lambda, functional]
---

In Python, functions are **first-class objects**: you can assign them to variables, store them in lists/dicts, pass them as arguments, and return them from other functions.

```python
# `lambda` creates a small single-expression anonymous function
users = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 22}]
by_age = sorted(users, key=lambda u: u["age"])

# `functools.partial` pre-fills arguments cleanly
from functools import partial
base2_int = partial(int, base=2)
print(base2_int("1010"))   # 10
```

**Functional built-ins:**

- `any(cond(x) for x in items)` / `all(...)` — short-circuiting boolean checks (prefer over manual flag loops).
- `map(fn, it)` and `filter(pred, it)` — lazy iterators; in Python, comprehensions (`[fn(x) for x in it if pred(x)]`) are usually clearer unless `fn` is already a named function like `map(str.strip, lines)`.
