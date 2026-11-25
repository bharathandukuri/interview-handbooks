---
type: predict
title: "Single-item tuple, star unpacking, and mutable items inside tuples"
difficulty: medium
tags: [tuples, unpacking, mutability, predict]
related:
  [
    python.lists-and-tuples.what-is-a-tuple,
    python.lists-and-tuples.tuple-unpacking,
  ]
revision:
  - "`(5)` is `int`; `(5,)` is `tuple`; `*mid` always creates a `list`"
  - "A list inside a tuple (`([1],)`) can still be mutated in place via `box[0].append(...)`"
options:
  - "<class 'tuple'> <class 'tuple'> (20, 30) ([1, 2], 'ok')"
  - "<class 'int'> <class 'tuple'> [20, 30] TypeError"
  - "<class 'int'> <class 'tuple'> [20, 30] ([1, 2], 'ok')"
  - "<class 'int'> <class 'int'> [20, 30] ([1, 2], 'ok')"
answer: 2
---

Check every tuple edge case carefully before predicting the output!

```python
x = (5)
y = (5,)
first, *mid, last = (10, 20, 30, 40)
box = ([1], "ok")
box[0].append(2)

print(type(x), type(y), mid, box)
```

## Output

```text
<class 'int'> <class 'tuple'> [20, 30] ([1, 2], 'ok')
```

## Explanation

1. **`x = (5)` vs `y = (5,)`:** Without a trailing comma, `(5)` is just brackets around integer `5` (`<class 'int'>`). Adding the comma in `(5,)` creates `<class 'tuple'>`.
2. **`first, *mid, last = (10, 20, 30, 40)`:** Even though the right side is a `tuple`, extended unpacking (`*mid`) **always** collects leftover values into a **`list`**, giving `[20, 30]`.
3. **`box[0].append(2)`:** You cannot replace slot `box[0]` (`box[0] = []` raises `TypeError`), **but** `box[0]` holds a mutable `list`. Calling `.append(2)` mutates that inner list in place, leaving `box` as `([1, 2], 'ok')`.
