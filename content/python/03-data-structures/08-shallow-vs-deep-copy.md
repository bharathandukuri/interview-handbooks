---
type: question
title: "Shallow copy vs deep copy"
difficulty: medium
mostAsked: true
tags: [memory, mutability, stdlib]
revision:
  - "`copy.copy()` copies the outer container but shares nested mutable object references"
  - "`copy.deepcopy()` recursively copies all nested objects — fully independent"
  - "Built-in `.copy()` and `lst[:]` are always **shallow** copies"
---

## Answer

A **shallow copy** creates a new container object but fills it with references to the same nested objects as the original. Modifying a nested mutable object through either copy affects both. Use `copy.copy()`, `lst[:]`, or `dict.copy()`.

A **deep copy** recursively duplicates every object in the graph, so the copy is completely independent. Use `copy.deepcopy()`.

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

original[0].append(99)
print(shallow[0])  # [1, 2, 99]  ← shared inner list
print(deep[0])     # [1, 2]      ← independent copy
```

## Why interviewers ask

It checks whether you understand Python's reference model and can spot aliasing bugs in caching, configs, and test fixtures.

## Follow-ups

- When is `deepcopy` unnecessarily expensive?
- How does `deepcopy` avoid infinite recursion on circular references (`memo` dict)?
