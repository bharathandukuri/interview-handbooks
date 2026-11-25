---
type: concept
title: "First-class functions, lambda, and sorting dicts by value"
difficulty: easy
mostAsked: true
tags: [functions, lambda, sorting, functional]
related: [python.comprehensions-and-sorting.sorted-and-sort-with-key]
revision:
  - "Functions are **first-class objects**: assign them to names, store them in dicts/lists, and pass them as arguments"
  - "`lambda args: expression` writes a compact single-expression anonymous function"
  - "Use `sorted(d.items(), key=lambda pair: pair[1], reverse=True)` to sort dictionaries by value"
---

In Python, functions are **first-class objects** — just like integers or strings, you can save a function in a variable or pass it into another function (`sorted(..., key=...)`).

A **`lambda`** creates a small, unnamed (**anonymous**) one-line function inline when you need a quick callback:

```python
# lambda arguments: single_expression (returns result automatically!)
double = lambda x: x * 2
print(double(7))

users = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 22}]
by_age = sorted(users, key=lambda u: u["age"])
print([u["name"] for u in by_age])

# Sort a frequency dict from highest count to lowest count:
counts = {"apple": 2, "banana": 5, "cherry": 1}
top_items = sorted(counts.items(), key=lambda pair: pair[1], reverse=True)
print(top_items)
```

The screen shows:

```text
14
['Bob', 'Ada']
[('banana', 5), ('apple', 2), ('cherry', 1)]
```

Notice `lambda` can hold **only a single expression** (no `return`, loops, or assignments like `x = 1` inside it — though ternary `a if cond else b` is an expression and works!). Also note `map(fn, items)` and `filter(pred, items)` accept `lambda` too, though comprehensions are usually cleaner.
