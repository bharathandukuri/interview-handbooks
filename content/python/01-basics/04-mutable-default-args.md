---
type: pitfall
title: "Mutable default arguments"
difficulty: medium
mostAsked: true
tags: [functions, gotchas, mutability]
revision:
  - "Default argument expressions are evaluated **once** at function definition time"
  - "Use `None` as the sentinel and assign the mutable value inside the body"
---

## The trap

```python
def append_to(item, lst=[]):
    lst.append(item)
    return lst

print(append_to(1))  # [1]
print(append_to(2))  # [1, 2]  ← not [2]!
print(append_to(3))  # [1, 2, 3]
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

Python evaluates default argument values when the `def` statement executes, not each time the function is called. The list `[]` is created once and stored as `append_to.__defaults__[0]`. Every call without an explicit `lst` shares the same list object in memory.

The `None` sentinel pattern is idiomatic: `None` is a singleton and always evaluates as falsy, so `lst = lst or []` (or an explicit `is None` check) creates a fresh list per call.
