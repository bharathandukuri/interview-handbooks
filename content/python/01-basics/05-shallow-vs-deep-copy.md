---
type: question
title: "Shallow copy vs deep copy"
difficulty: medium
mostAsked: true
tags: [memory, mutability, stdlib]
revision:
  - "`copy.copy()` copies the container but shares nested object references"
  - "`copy.deepcopy()` recursively copies all nested objects — fully independent"
  - "Many built-ins have `.copy()` shorthand (list, dict, set) which is shallow"
---

## Answer

A **shallow copy** creates a new container object but fills it with references to the same nested objects as the original. Modifying a nested mutable object through either copy affects both. Use `copy.copy()` or `lst[:]` or `dict.copy()`.

A **deep copy** recursively duplicates every object in the structure, so the copy is fully independent. Use `copy.deepcopy()`.

```python
import copy

original = [[1, 2], [3, 4]]
shallow  = copy.copy(original)
deep     = copy.deepcopy(original)

original[0].append(99)
print(shallow[0])  # [1, 2, 99]  ← shared reference
print(deep[0])     # [1, 2]      ← independent copy
```

## Why interviewers ask

It tests whether you understand Python's reference model and can reason about aliasing bugs — common in caching, data pipelines, and test fixtures.

## Follow-ups

- When would deep copy be unnecessarily expensive?
- How does `deepcopy` handle circular references?
