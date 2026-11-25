---
type: predict
title: "Late binding trap: lambdas created inside a loop"
difficulty: hard
tags: [functions, scope, lambda, closures, gotchas]
related:
  [
    python.functions.scope-and-legb-rule,
    python.functions.first-class-functions-and-lambda,
    python.functions.positional-keyword-and-defaults,
  ]
options:
  - "[2, 2, 2]"
  - "[0, 1, 2]"
  - "[None, None, None]"
  - "NameError: name 'i' is not defined"
answer: 0
---

```python
funcs = []
for i in range(3):
    funcs.append(lambda: i)

print([f() for f in funcs])
```

## Output

```text
[2, 2, 2]
```

## Explanation

This is one of the most famous Python gotchas (**late-binding closures**):

1. When `lambda: i` is created inside the loop, Python does **not** snapshot the current integer value `0`, `1`, or `2` inside the lambda. Instead, the lambda remembers the _variable name_ `i` and looks it up via the **LEGB rule** **when the function is called later**.
2. By the time `[f() for f in funcs]` actually calls each lambda, the `for` loop has already finished, and `i` holds its final value `2`.
3. Every lambda looks up `i`, finds `2`, and returns `2` -> `[2, 2, 2]`.

**How to fix it when you actually want `[0, 1, 2]`:** capture the current value at creation time using a **default parameter** (remember defaults are evaluated immediately when defined!):

```python
funcs = [lambda i=i: i for i in range(3)]   # returns [0, 1, 2]
```
