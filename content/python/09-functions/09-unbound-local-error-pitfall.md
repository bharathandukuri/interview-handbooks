---
type: pitfall
title: "UnboundLocalError: reading a variable before assigning locally"
difficulty: medium
mostAsked: true
tags: [functions, scope, legb, gotchas]
related: [python.functions.scope-and-legb-rule]
revision:
  - "Assigning `x = ...` or `x += 1` **anywhere** inside a function marks `x` as local for the **entire** function"
  - "Reading `x` before that assignment raises `UnboundLocalError` even if a global `x` exists!"
---

## The trap

```python
count = 10

def increment():
    count += 1       # tries to READ local `count` first, then assign!
    return count

# increment()        # UnboundLocalError: cannot access local variable 'count'
```

## The fix

```python
# Best fix: pass the value in and return the updated value (pure function!)
def increment(count):
    return count + 1

count = 10
count = increment(count)
print(count)         # 11
```

(Or, if modifying module/enclosing state explicitly, declare `global count` or `nonlocal count` at the top of the function.)

## Why it happens

Python determines which variables are **local** at compile time (when reading `def`), **not** line by line as the function runs! Because `count += 1` is an assignment (`count = count + 1`), Python marks `count` as a **local variable for the whole body of `increment()`**. When line 1 tries to evaluate `count + 1`, the local slot `count` has not been assigned yet — crashing with **`UnboundLocalError`** instead of looking out at the global `count = 10`!
