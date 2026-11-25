---
type: predict
title: "List comprehension scope in Python 3"
difficulty: easy
tags: [comprehensions, generators, scoping]
options:
  - "NameError"
  - "2 — no error"
  - "2 NameError"
  - "0 NameError"
answer: 0
---

```python
x = 10
result = [x for x in range(3)]
print(x)
```

## Output

```text
10
```

## Explanation

In **Python 3**, list comprehensions have their **own scope** — the loop variable `x` does not leak into the enclosing scope. So `x` is still `10` after the comprehension.

This was a known Python 2 bug where list comp variables _did_ leak. Generator expressions never leaked (even in Python 2), and Python 3 fixed list/set/dict comprehensions to match.

```python
# Generator expression — variable never leaks, not even in Python 2
gen = (y for y in range(3))
# print(y)  → NameError in both Python 2 and 3

# If you actually need the last value, use a plain loop:
last = None
for last in range(3):
    pass
print(last)  # 2
```

:::insight[Interview signal]
Knowing this distinction shows you understand Python 3's scoping rules and can reason about subtle Python 2 → 3 migration bugs.
:::
