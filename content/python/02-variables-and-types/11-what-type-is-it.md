---
type: predict
title: "Predict the exact type() of 7, 7.0, '7', and True"
difficulty: easy
tags: [types, quotes, basics, trace]
related: [python.variables-and-types.type-and-basic-types]
options:
  - "<class 'int'> / <class 'float'> / <class 'str'> / <class 'bool'>"
  - "<class 'int'> / <class 'int'> / <class 'int'> / <class 'int'>"
  - "<class 'int'> / <class 'float'> / <class 'int'> / <class 'bool'>"
  - "<class 'int'> / <class 'float'> / <class 'str'> / <class 'int'>"
answer: 0
---

Look closely at quotes, decimal points, and capitalization before checking the output:

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

Even though `7`, `7.0`, and `"7"` look almost identical to human eyes, punctuation tells Python which type to build:

1. **`7`** has no quotes and no decimal point -> **`int`** (whole number).
2. **`7.0`** has a decimal point -> **`float`**, even though its numeric value equals `7` (`7 == 7.0` is `True`, yet their types differ!).
3. **`"7"`** sits inside quotes -> **`str`** (`"7" == 7` is `False`, and `"7" + 1` raises `TypeError`).
4. **`True`** is a capitalized boolean keyword -> **`bool`** (remember `"True"` in quotes would become a `str` instead!).
