---
type: question
title: "Is Python pass-by-value or pass-by-reference?"
difficulty: medium
mostAsked: true
tags: [functions, parameters, references, interviews]
related:
  [
    python.functions.parameter-passing-by-assignment-predict,
    python.lists-and-tuples.aliasing-and-copying-lists,
  ]
revision:
  - "Python is neither C-style pass-by-value nor pass-by-reference — it uses **pass-by-object-reference** (**pass-by-assignment**)"
  - "Inside the function, **mutating** a mutable argument changes the caller's object; **rebinding** the parameter name only changes the local reference"
---

## Answer

Python uses **pass-by-object-reference** (also called **pass-by-assignment**):

- Every variable in Python holds a **reference** (a pointer) to an object in memory, never the raw object bytes themselves.
- Calling `fn(arg)` copies the **reference** into the function's parameter — **not** the whole object, so passing a 10-million-item list takes instant `O(1)` time.
- What happens inside `fn` depends on **mutability** and **reassignment**:
  - **Immutable objects (`int`, `str`, `tuple`):** Cannot be changed in place. Writing `x += 1` inside `fn` rebinds local `x` to a brand-new `int`; the caller's variable is untouched.
  - **Mutable objects (`list`, `dict`, `set`):** Calling `.append()`, `d[k] = v`, or `lst.sort()` changes the **shared object**, so the caller sees those changes! However, rebinding `lst = [99]` only moves the local label `lst` to a new list without touching the caller's list.

Notice one subtle case: for a `list`, `items += [4]` calls in-place extension (`__iadd__`), so it **mutates** the caller's list, whereas `items = items + [4]` creates a new list and rebinds local `items`!

**A short answer for an interview:** Python uses pass-by-object-reference: the caller's object reference is assigned to the parameter, so in-place mutations on mutable arguments are visible to the caller, while reassigning the parameter name only changes the local variable.

## Why interviewers ask

Candidates coming from C++ or Java often mislabel Python as pure pass-by-value or pass-by-reference. Explaining the difference between **mutating an object** and **rebinding a name** proves you understand Python's object model — which prevents subtle aliasing bugs in real codebases.

## Follow-ups

- **"How do I safely pass a list if my function needs to modify it locally without affecting the caller?"** Make a shallow copy at the top (`items = list(items)` or `items.copy()`), or `copy.deepcopy(items)` if it contains nested mutable lists/dicts.
- **"Does `items += [4]` behave the same as `items = items + [4]` inside a function?"** Not on mutable sequences! `items += [4]` mutates the caller's list in place, whereas `items = items + [4]` builds a new list locally and leaves the caller's list unchanged.
