---
type: predict
title: "Integer interning and identity"
difficulty: medium
tags: [interning, identity, cpython]
options:
  - "True True"
  - "True False"
  - "False True"
  - "False False"
answer: 1
---

```python
a, b = 256, 256
c, d = 257, 257
print(a is b, c is d)
```

## Output

```text
True False
```

## Explanation

CPython **interns** (caches and reuses) small integers in the range **-5 to 256**. `256` hits the cache, so `a` and `b` are literally the same object — `is` returns `True`.

`257` is outside the cache range. CPython creates a fresh int object each time it evaluates `257`, so `c` and `d` are two separate objects with the same value — `is` returns `False`.

:::pitfall[Always use `==` for value comparison]
Never rely on `is` to compare integers (or strings) for equality in real code. The interning range is a CPython implementation detail — PyPy, Jython, or future CPython versions may behave differently.
:::

```python
# Correct pattern for value equality:
print(a == b)   # True — always reliable
print(c == d)   # True — always reliable
```
