---
type: question
title: "Mutable vs immutable: why does it matter?"
difficulty: easy
tags: [data-types, memory]
mostAsked: true
related: [python.basics.is-vs-equals]
revision:
  - Strings, tuples, and ints are immutable; lists, dicts, and sets are mutable
  - Mutable objects shared between names change everywhere in place
---

## Answer

An immutable object cannot change its value after creation, so any update creates a new object in memory. A mutable object changes in place at the same memory address.

This matters because Python variables are just labels bound to objects, not boxes holding copies. If two names point at the same list, mutating it through one name changes what the other sees. Rebinding an integer or string only moves one label to a brand-new object.

```python
a = [1, 2]
b = a
b.append(3)
print(a)  # [1, 2, 3]
```

:::insight[Interview insight]
This question is a doorway to mutable default arguments, dictionary key hashability, and `copy` vs `deepcopy`.
:::

## Why interviewers ask

It checks whether you understand Python's object-reference model rather than memorizing syntax.

## Follow-ups

- Why can tuples be dictionary keys while lists cannot?
- Is a tuple containing a list really immutable?
- When does `+=` mutate in place versus rebind?
