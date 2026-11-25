---
type: compare
title: ".sort() vs sorted(): in-place mutation vs new list"
difficulty: easy
mostAsked: true
left: "lst.sort()"
right: "sorted(iterable)"
tags: [sorting, lists, pythonic]
related:
  [
    python.comprehensions-and-sorting.sorted-and-sort-with-key,
    python.lists-and-tuples.sort-returns-none-and-mutating-loop,
  ]
revision:
  - "`.sort()` works **only on lists**, mutates **in place**, and returns `None`"
  - "`sorted()` accepts **any iterable**, leaves the original untouched, and returns a **new list**"
---

Both use Python's **Timsort** algorithm (`O(n log n)` time, stable), yet picking the wrong one causes bugs or unnecessary memory copies:

| Feature                | `lst.sort(key=..., reverse=...)`              | `sorted(iterable, key=..., reverse=...)`                     |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| What types can use it? | `list` only (`(1, 2).sort()` fails!)          | Any iterable (`list`, `tuple`, `str`, `set`, `dict.items()`) |
| Modifies original?     | ✅ Yes (mutates `lst` directly!)              | ❌ No (original stays untouched)                             |
| Return value           | **`None`** (trap if assigned: `x = a.sort()`) | A brand-new `list`                                           |
| Memory usage           | Lower (sorts in place)                        | Allocates a new `list` copy                                  |

## Verdict

Use **`sorted(...)`** by default whenever you do not own the data (like a caller's input list), need to sort non-list inputs (like `tuple` or `dict` keys), or want to keep the original order intact. Use **`.sort()`** when working directly on a huge `list` that you are happy to overwrite in place to save memory.
