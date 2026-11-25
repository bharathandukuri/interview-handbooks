---
type: predict
title: "Reassigning a variable using its own old value"
difficulty: easy
tags: [variables, assignment, trace]
related: [python.variables-and-types.what-is-a-variable]
options:
  - "15"
  - "10"
  - "5"
  - "SyntaxError or NameError"
answer: 0
---

A variable can be updated at any time — even using its own current value in the formula. Trace what prints:

```python
score = 10
score = score + 5
print(score)
```

## Output

```text
15
```

## Explanation

Trace each step using Python's **"evaluate right side first, then bind left name"** rule:

1. `score = 10` creates integer `10` and sticks label `score` onto it.
2. On `score = score + 5`:
   - First, Python evaluates the **right-hand expression** `score + 5`, reading `10 + 5` -> **`15`**.
   - Next, Python moves the sticky note `score` away from `10` and attaches it onto **`15`**.
3. `print(score)` prints `15`. (In Chapter 03, you will also learn shorthand `score += 5` for updating numbers in one step!)
