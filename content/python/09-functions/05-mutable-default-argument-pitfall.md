---
type: pitfall
title: "Mutable default arguments (def f(items=[]))"
difficulty: medium
mostAsked: true
tags: [functions, gotchas, mutability, edge-cases]
related:
  [
    python.functions.positional-keyword-and-defaults,
    python.lists-and-tuples.aliasing-and-copying-lists,
  ]
revision:
  - "Default parameter values are created **once** when `def` executes — NOT freshly on every call!"
  - "Never write `items=[]` or `cache={}` as a default parameter; use **`None` as a sentinel** and initialize inside"
---

## The trap

```python
def add_item(item, cart=[]):
    cart.append(item)
    return cart

print(add_item("apple"))      # ['apple']
print(add_item("banana"))     # ['apple', 'banana']  <-- shared old list!
```

## The fix

```python
def add_item(item, cart=None):
    if cart is None:          # fresh list on every call when omitted!
        cart = []
    cart.append(item)
    return cart

print(add_item("apple"))      # ['apple']
print(add_item("banana"))     # ['banana']
```

## Why it happens

Python evaluates default expressions **only once** at the moment the `def add_item(...)` statement runs — saving that exact `[]` list object inside `add_item.__defaults__`. Every subsequent call that omits `cart` receives and mutates that exact same list!

Notice also why the fix checks `if cart is None:` rather than `cart = cart or []`: if a caller explicitly passes their own empty list `my_list = []; add_item("x", my_list)`, `cart or []` would throw away `my_list` and miss mutating it! Explicit `is None` handles empty caller lists accurately.
