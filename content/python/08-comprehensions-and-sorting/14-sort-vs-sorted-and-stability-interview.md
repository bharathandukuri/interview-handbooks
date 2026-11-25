---
type: question
title: "What is the difference between .sort() and sorted(), and what does 'stable sort' mean?"
difficulty: medium
mostAsked: true
tags: [interview, sorting, timsort, lists]
related:
  [
    python.comprehensions-and-sorting.sort-vs-sorted,
    python.comprehensions-and-sorting.multi-level-sorting-and-tuples,
  ]
revision:
  - "`.sort()` mutates a list in place and returns `None`; `sorted()` works on any iterable and returns a new list"
  - "Python uses **Timsort** (`O(n log n)` worst-case, fast `O(n)` on already-sorted runs) and is **stable**"
  - "**Stable** means equal keys keep their original input order — enabling multi-pass secondary sorting"
---

## Answer

1. **`lst.sort()` vs `sorted(iterable)`:** `.sort()` works **only on lists**, mutates the list directly in place, and returns **`None`**. `sorted()` accepts **any iterable** (`tuple`, `str`, `dict`, `set`, generator), leaves it untouched, and returns a **new sorted list**.
2. **Algorithm (Timsort):** Both use **Timsort** (a hybrid of merge sort and insertion sort tuned for real-world partially ordered data), taking `O(n log n)` worst-case time (`O(n)` when nearly sorted!).
3. **Stability:** A **stable sort** guarantees that whenever two items have equal sort keys (e.g. `("Alice", 90)` and `("Bob", 90)` sorted by score), their original relative order stays preserved (`"Alice"` remains before `"Bob"`).

A short answer for an interview: "`.sort()` mutates a list in place and returns `None`, while `sorted()` works on any iterable and returns a new list. Both use Timsort, which is O(n log n) and stable so ties preserve their original order."

## Why interviewers ask

Accidental `x = my_list.sort()` (`None` bug!) and relying on stability for multi-criteria sorting come up constantly in coding interviews.

## Follow-ups

- How do you sort items by primary field descending and secondary field ascending? (Sort secondary ascending first, then primary `reverse=True` — relying on stability!)
- Does `key=len` change the values inside the sorted list? (No — `key` only computes temporary comparison values.)
