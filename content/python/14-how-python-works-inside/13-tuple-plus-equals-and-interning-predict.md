---
type: predict
title: "The classic tuple += list puzzle (t[0] += [3])"
difficulty: hard
mostAsked: true
tags: [internals, tuples, bytecode, mutability, trace]
related:
  [
    python.lists-and-tuples.tuple-edge-cases-predict,
    python.how-python-works-inside.bytecode-and-dis,
  ]
revision:
  - "`t[0] += [3]` mutates the list inside `t[0]` **first**, THEN raises `TypeError` when trying to reassign `t[0]`!"
  - "As a result, catching `TypeError` leaves the tuple holding the **mutated** list `([1, 2, 3], 'hi')`!"
options:
  - "Error: TypeError\nTuple: ([1, 2, 3], 'hi')"
  - "Error: TypeError\nTuple: ([1, 2], 'hi')"
  - "No error\nTuple: ([1, 2, 3], 'hi')"
  - "Error: AttributeError\nTuple: ([1, 2], 'hi')"
answer: 0
---

```python
t = ([1, 2], "hi")
try:
    t[0] += [3]
except TypeError as err:
    print("Error:", type(err).__name__)

print("Tuple:", t)
```

## Output

```text
Error: TypeError
Tuple: ([1, 2, 3], 'hi')
```

## Explanation

This famous Python internals puzzle shows exactly what `t[0] += [3]` compiles to in bytecode:

1. **Read & call `__iadd__`:** Python loads `t[0]` (the list `[1, 2]`) and calls its in-place addition method (`__iadd__([3])`). That **mutates the list object in place** to `[1, 2, 3]` and returns a reference to that same list!
2. **Assign back (`STORE_SUBSCR`):** Next, `+=` tries to store the result back into `t[0] = ...`. Because tuples are immutable and forbid item assignment, Python raises **`TypeError: 'tuple' object does not support item assignment`**!
3. **Damage already done:** Catching `TypeError` saves the script from crashing, **but** step 1 already appended `3` to the mutable list inside the tuple — so `t` is now `([1, 2, 3], 'hi')`!

_Lesson:_ Avoid putting mutable containers inside tuples if immutability matters — or call `t[0].extend([3])` explicitly instead of `+=`!
