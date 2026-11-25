---
type: predict
title: "`is` vs `==` on lists and aliases"
difficulty: easy
tags: [equality, identity, memory]
mostAsked: false
options:
  - "True False / True True"
  - "True True / True True"
  - "False False / True True"
  - "True False / False True"
answer: 0
revision:
  - "`==` compares values (`__eq__`); `is` compares object identity (`id()`)"
  - "Use `is` for singletons like `None`, never for numbers or strings"
---

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b, a is b)
print(a == c, a is c)
```

## Output

```text
True False
True True
```

## Explanation

`a` and `b` hold equal elements, so `a == b` calls `list.__eq__` and returns `True`. Because each list literal allocates a distinct object in memory, `a is b` (`id(a) == id(b)`) is `False`.

Assigning `c = a` binds a second name to the exact same list object, so both `a == c` and `a is c` are `True`.

:::tip[Rule of thumb]
Always use `is None` or `is not None` for singleton checks. Never rely on `is` for integers or strings because CPython caching and compiler constant folding are implementation details.
:::
