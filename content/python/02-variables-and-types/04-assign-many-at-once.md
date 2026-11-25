---
type: concept
title: "Save many values at once"
difficulty: easy
tags: [variables, assignment, swap]
revision:
  - "`x, y = 1, 2` saves two values in one line"
  - "`x, y = y, x` swaps two variables, with no helper variable"
---

You can save several values in one line.

```python
x, y = 1, 2
a = b = 0
print(x, y, a, b)

x, y = y, x
print(x, y)
```

The screen shows:

```text
1 2 0 0
2 1
```

- `x, y = 1, 2` gives `x` the value 1 and `y` the value 2.
- `a = b = 0` gives both names the same value, 0.
- `x, y = y, x` **swaps** the two values.

The swap is a famous Python trick. In many languages you need a third helper variable to swap. In Python you do not. Python works out the whole right side first, and only then saves the results on the left, so nothing gets lost.
