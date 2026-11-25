---
type: concept
title: "Sorting with sorted(), key=, and reverse=True"
difficulty: easy
mostAsked: true
tags: [sorting, sorted, timsort, edge-cases]
related: [python.lists-and-tuples.sort-returns-none-and-mutating-loop]
revision:
  - "`sorted(items, key=..., reverse=...)` returns a **new sorted list** without modifying the input"
  - "`key=` applies a function (like `len`, `abs`, or `str.lower`) to compute each item's comparison key **without altering the actual output values**"
  - "Python's **Timsort** is **stable**: ties preserve their original relative order"
---

`sorted()` sorts **any iterable** (list, tuple, string, set, dict keys) in `O(n log n)` time and always returns a **brand-new list**.

```python
nums = [-10, 3, -2, 7]
print(sorted(nums))                    # ascending -> [-10, -2, 3, 7]
print(sorted(nums, reverse=True))      # descending -> [7, 3, -2, -10]
print(sorted(nums, key=abs))           # sort by absolute value -> [-2, 3, 7, -10]

words = ["Banana", "apple", "cherry"]
print(sorted(words))                   # uppercase first! ['Banana', 'apple', 'cherry']
print(sorted(words, key=str.lower))    # case-insensitive! ['apple', 'Banana', 'cherry']
```

The screen shows:

```text
[-10, -2, 3, 7]
[7, 3, -2, -10]
[-2, 3, 7, -10]
['Banana', 'apple', 'cherry']
['apple', 'Banana', 'cherry']
```

**Important sorting rules and edge cases:**

- **`key=` transforms only the comparison key:** Notice `sorted(nums, key=abs)` keeps `-2` and `-10` negative in the returned list! (In Chapter 9, you will learn how to write your own custom `lambda` keys like sorting dicts by value.)
- **Case sensitivity:** Plain `sorted(["Banana", "apple"])` puts `"Banana"` first because `'B'` (ASCII `66`) < `'a'` (`97`). Pass `key=str.lower` for natural alphabetical order!
- **Mixed uncomparable types:** `sorted([1, "a"])` raises `TypeError` because Python cannot compare `<` between `int` and `str`.
- **Stability (Timsort):** When two items have the same key (`len("cat") == len("dog")`), `sorted()` guarantees they stay in their exact original order!
