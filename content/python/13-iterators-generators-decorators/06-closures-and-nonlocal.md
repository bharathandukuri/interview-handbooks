---
type: concept
title: "Closures and nonlocal state"
difficulty: medium
mostAsked: true
tags: [closures, scope, legb, functional]
related:
  [
    python.functions.scope-and-legb-rule,
    python.functions.default-args-and-scope-predict,
  ]
revision:
  - "A **closure** is a nested function that remembers variables from its enclosing function's scope even after the outer function has returned"
  - "Read enclosing variables freely; use **`nonlocal`** when rebinding an enclosing variable inside the inner function"
  - "Be careful creating closures inside loops — loop variables are captured by reference (**late binding**)"
---

Because functions are **first-class objects**, an outer function can create and `return` an inner function. When that inner function still uses variables defined inside the outer function — **even after the outer function has finished running** — that inner function plus its remembered scope cells is called a **closure**.

```python
def make_counter(start=0):
    count = start                       # enclosing variable captured in closure cell

    def increment(step=1):
        nonlocal count                  # required to rebind `count` in enclosing scope!
        count += step
        return count

    return increment

clicks = make_counter(10)
other = make_counter()
print("clicks:", clicks(), clicks(5))
print("other (independent state):", other())
print("captured values:", [c.cell_contents for c in clicks.__closure__])
```

The screen shows:

```text
clicks: 11 16
other (independent state): 1
captured values: [16]
```

**Why closures exist and what edge cases apply:**

- **Factory functions & decorators:** Every call to `make_counter()` produces an independent closure cell (`clicks` at `16`, `other` at `1`) — a lightweight alternative to a single-method class, and the core mechanism behind **decorators** in the next card!
- **Why `nonlocal` was needed:** Without `nonlocal count`, writing `count += step` would trigger `UnboundLocalError` because Python marks assigned variables as local (Chapter 09). Note: if you mutate a captured mutable container (`history.append(x)`), you do _not_ need `nonlocal` because you are mutating, not rebinding!
- **Remember late binding in loops:** Closures remember the _variable binding_ (cell), not its old value at creation time — capture loop values explicitly via a helper function factory `make_handler(i)` or default parameter `i=i`!
