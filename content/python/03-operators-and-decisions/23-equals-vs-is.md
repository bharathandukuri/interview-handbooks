---
type: question
title: "What is the difference between == and is?"
difficulty: easy
mostAsked: true
tags: [interview, comparison, none]
related:
  [
    python.operators-and-decisions.comparing-values,
    python.variables-and-types.none,
  ]
revision:
  - "`==` checks **value equality** (do these hold the same value?)"
  - "`is` checks **object identity** (are these two names pointing to the exact same object in memory?)"
  - "Use `is None` / `is not None` for `None`; use `==` for numbers and text"
---

## Answer

`==` checks **value equality**: do two objects contain equal values? `is` checks **object identity**: do two names point to the exact same object at the same memory address?

Think of two identical copies of a book versus one physical book held by two friends. The copies have identical words (`==` is `True`), yet they are two distinct books (`is` is `False`).

```python
x = None
print(x is None)      # True — only one None object exists in Python
print(5 == 5.0)       # True — int 5 and float 5.0 have equal numeric value
print(5 is 5.0)       # False — an int and a float are different objects in memory
```

A short answer for an interview: "`==` compares values, while `is` checks whether both variables reference the exact same object in memory. Always use `is` for singletons like `None`, `True`, or `False`, and `==` for comparing numbers or strings."

## Why interviewers ask

Beginners often write `if x == None:` or accidentally use `is` to compare numbers or user input strings — which fails mysteriously for large numbers or freshly created text! (Chapter 14 explains CPython object identity and caching in detail.)

## Follow-ups

- Why does `5 == 5.0` give `True` while `5 is 5.0` gives `False`?
- Why should you check `if x is None:` instead of `if x == None:`?
- What happens if you check `1000 is 1000` vs `int("1000") is int("1000")`?
