---
type: predict
title: "Late binding in closures"
difficulty: medium
mostAsked: true
tags: [closures, scoping, functions]
revision:
  - "Closures look up variables by **name** when called, not by value at definition time"
  - "Bind loop variables with a default argument (`lambda i=i: i`) to capture the current value"
options:
  - "[0, 0, 0, 0, 0]"
  - "[0, 1, 2, 3, 4]"
  - "[4, 4, 4, 4, 4]"
  - "TypeError"
answer: 2
---

```python
funcs = [lambda: i for i in range(5)]
print([f() for f in funcs])
```

## Output

```text
[4, 4, 4, 4, 4]
```

## Explanation

Each lambda captures `i` **by name**, not by value. By the time you call any of them the loop has finished and `i` is `4`. All five lambdas look up the same `i` in the enclosing scope and find `4`.

**Fix — capture the value at definition time with a default argument:**

```python
funcs = [lambda i=i: i for i in range(5)]
print([f() for f in funcs])  # [0, 1, 2, 3, 4]
```

Default argument values are evaluated immediately, so each lambda gets its own private copy of `i`.
