---
type: predict
title: "List comprehension scope in Python 3"
difficulty: easy
tags: [comprehensions, scoping, basics]
options:
  - "10"
  - "2"
  - "NameError"
  - "[0, 1, 2]"
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

In **Python 3**, list, set, and dict comprehensions run in their **own isolated scope** — the comprehension's loop variable `x` does not leak or overwrite `x` in the enclosing scope. So `print(x)` outputs `10`.

(In Python 2, list comprehensions leaked `x` and overwrote `10` with `2`; generator expressions never leaked in either version.)

If you intentionally want to capture the last element of a sequence, use a regular `for` loop instead of relying on comprehension side effects.
