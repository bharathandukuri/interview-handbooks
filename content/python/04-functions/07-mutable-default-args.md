---
type: pitfall
title: "Mutable default arguments"
difficulty: medium
mostAsked: true
tags: [functions, gotchas, mutability]
revision:
  - "Default argument expressions are evaluated **once** at function definition time"
  - "Use `None` as the sentinel and create a fresh mutable container inside the body"
---

## The trap

```python
def append_to(item, lst=[]):
    lst.append(item)
    return lst

print(append_to(1))  # [1]
print(append_to(2))  # [1, 2]  ← not [2]!
```

## The fix

```python
def append_to(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

## Why it happens

Python evaluates default argument values once when the `def` statement executes, not on each call. The list `[]` is stored in `append_to.__defaults__[0]`, so every call omitting `lst` mutates that exact same list. Using `None` as a sentinel creates a brand-new list inside the call.
