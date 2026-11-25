---
type: concept
title: "`functools` power tools: `partial`, `reduce`, `singledispatch`"
difficulty: medium
tags: [functools, functional, stdlib]
---

Beyond `@wraps` and `@cache`, `functools` includes several high-leverage utilities:

```python
from functools import partial, reduce, singledispatch, total_ordering

# 1. partial — freeze leading arguments into a specialized callable
hex_int = partial(int, base=16)
print(hex_int("ff"))                     # 255

# 2. reduce — fold an iterable left-to-right (prefer sum/math.prod when applicable)
product = reduce(lambda a, b: a * b, [2, 3, 4], 1)   # 24

# 3. singledispatch — function overloading based on first argument's type
@singledispatch
def serialize(val: object) -> str:
    return str(val)

@serialize.register
def _(val: list) -> str:
    return f"[{', '.join(map(serialize, val))}]"
```

Use `@total_ordering` on classes that define `__eq__` and `__lt__` to automatically generate `<=`, `>`, and `>=`.
