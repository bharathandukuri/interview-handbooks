---
type: concept
title: "Aliasing vs shallow copy (copy.copy) vs deep copy (copy.deepcopy)"
difficulty: medium
mostAsked: true
tags: [internals, copying, mutability, memory]
related:
  [
    python.lists-and-tuples.aliasing-and-copying-lists,
    python.how-python-works-inside.names-objects-and-id,
  ]
revision:
  - "**Aliasing (`b = a`):** shares the exact same outer and inner objects"
  - "**Shallow copy (`a.copy()`, `list(a)`, `a[:]`, `copy.copy(a)`):** builds a new outer container, **but still shares nested mutable objects inside it**"
  - "**Deep copy (`copy.deepcopy(a)`):** recursively duplicates every nested object and handles circular references via a `memo` table"
---

When copying nested structures (lists of lists, dicts containing lists, custom objects), knowing **how deep** the copy reaches prevents baffling shared-state bugs:

```python
import copy

original = [[1, 2], [3, 4]]

alias = original                    # level 0: exact same list
shallow = original.copy()           # level 1: new outer list, SAME inner lists!
deep = copy.deepcopy(original)      # level N: brand-new outer + inner lists!

shallow[0].append(99)               # mutates nested inner list `[1, 2]` -> hits `original` too!
deep[1].append(888)                 # completely isolated from `original`!

print("original:", original)
print("shallow: ", shallow)
print("deep:    ", deep)

# Circular reference test: deepcopy tracks seen object ids in a memo dict so it won't loop forever!
node = []
node.append(node)
cloned_cycle = copy.deepcopy(node)
print("cycle preserved safely?", cloned_cycle is not node and cloned_cycle[0] is cloned_cycle)
```

The screen shows:

```text
original: [[1, 2, 99], [3, 4]]
shallow:  [[1, 2, 99], [3, 4]]
deep:     [[1, 2], [3, 4, 888]]
cycle preserved safely? True
```

**Important edge cases on copying:**

- **Dictionary `.copy()` / slicing `[:]` / `dict(d)` / `{**d}`** are **ALL shallow copies**! Changing `shallow["tags"].append("new")` still mutates `original["tags"]`.
- **Immutable optimizations:** Calling `copy.copy((1, 2))` or `copy.deepcopy("abc")` may return the exact same immutable object (`id` unchanged) because immutable objects cannot be mutated anyway — _except_ a `tuple` containing a mutable `list`, like `([1, 2],)`, where `copy.deepcopy` **does** build a brand-new tuple holding a cloned list!
- **Customizing copies (`__copy__` & `__deepcopy__`):** Custom classes holding database connections or caches can define `__deepcopy__(self, memo)` to skip or clone heavyweight fields explicitly.
