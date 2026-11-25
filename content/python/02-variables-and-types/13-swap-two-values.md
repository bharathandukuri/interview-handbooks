---
type: problem
title: "Swap two values"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Save many values at once"
tags: [variables, swap, practice]
related: [python.variables-and-types.assign-many-at-once]
---

## Problem

You have two variables:

```python
a = 5
b = 9
```

Swap them, so `a` holds 9 and `b` holds 5. Then print both on one line.

```text
9 5
```

## Hint

- If you write `a = b` first, you lose the old value of `a`.
- Python can save many values in one line.
- Python works out the right side first.

## Solution

```python
a = 5
b = 9

a, b = b, a
print(a, b)
```

## Walkthrough

On the right side, `b, a` becomes the pair `(9, 5)`. Python builds this pair **first**. Then it saves 9 under `a` and 5 under `b`. Nothing is lost.

You can also swap the older way, with a helper variable. It works in every language, but it takes three lines:

```python
temp = a
a = b
b = temp
```

`temp` holds the old `a` safely, so that `a = b` does not destroy it.
