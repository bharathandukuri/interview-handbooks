---
type: predict
title: "Rebinding vs mutating arguments inside a function"
difficulty: medium
mostAsked: true
tags: [functions, references, mutability, trace]
related:
  [
    python.functions.defining-and-calling-functions,
    python.lists-and-tuples.aliasing-and-copying-lists,
  ]
revision:
  - "Mutating a parameter (`items.append(4)`) changes the caller's list because both names point to the **same object**"
  - "Reassigning a parameter (`x = ...` or `items = [99]`) only rebinds the **local name** and leaves the caller untouched"
options:
  - "5 [1, 2, 3, 4]"
  - "15 [99]"
  - "5 [1, 2, 3]"
  - "5 [99]"
answer: 0
---

```python
def update(x, items):
    x = x + 10
    items.append(4)
    items = [99]

num = 5
data = [1, 2, 3]
update(num, data)
print(num, data)
```

## Output

```text
5 [1, 2, 3, 4]
```

## Explanation

Trace each line inside `update(num, data)` carefully:

1. When `update` starts, parameter `x` points to `5` (`num`) and parameter `items` points to `[1, 2, 3]` (`data`).
2. `x = x + 10` creates a new integer `15` and points the **local name** `x` at it. Outside the function, `num` still points to `5` (and integers are immutable anyway).
3. `items.append(4)` modifies the existing list object **in place**, changing `[1, 2, 3]` to `[1, 2, 3, 4]`. Because `data` points to that same list object, `data` now sees `4` too.
4. `items = [99]` creates a brand-new list `[99]` and points the local parameter `items` at it. That assignment breaks the link between local `items` and `data`, leaving `data` pointing to `[1, 2, 3, 4]`.

When `update` returns, `print(num, data)` outputs `5 [1, 2, 3, 4]`.
