---
type: predict
title: "What types are these?"
difficulty: easy
tags: [types, quotes]
related: [python.variables-and-types.type-and-basic-types]
options:
  - "int, int, int, int"
  - "int, float, str, bool"
  - "int, float, int, bool"
  - "int, float, str, str"
answer: 1
---

Look at the four values. Guess the type of each one.

```python
print(type(7))
print(type(7.0))
print(type("7"))
print(type(True))
```

## Output

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

## Explanation

- `7` is a whole number, so it is an `int`.
- `7.0` has a decimal point, so it is a `float`, even though the value is the same.
- `"7"` is inside quotes, so it is text (`str`).
- `True` is a `bool`.

All four look like "seven" or "yes", but they are four different types.
