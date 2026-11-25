---
type: predict
title: "`is` vs `==` on lists and aliases"
difficulty: easy
tags: [basics, identity, equality]
mostAsked: true
related: [python.basics.mutable-vs-immutable]
revision:
  - "`==` checks value equality (`__eq__`); `is` checks object identity (`id(a) == id(b)`)"
  - "Reserve `is` for singletons (`None`, `True`, `False`) and sentinel objects"
options:
  - "True True"
  - "True False"
  - "False True"
  - "False False"
answer: 1
---

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b, a is b)
print(a is c)
```

## Output

```text
True False
True
```

## Explanation

`a == b` compares the **values** inside the lists — both hold `[1, 2, 3]`, so it prints `True`.

`a is b` compares **object identity** (`id(a) == id(b)`). Each `[1, 2, 3]` literal creates a distinct list object in memory, so `a is b` is `False`.

`c = a` binds `c` to the exact same object as `a`, so `a is c` is `True`.

Reserve `is` for singletons such as `None`, `True`, `False`, or module-level sentinels — use `==` for value comparisons.
