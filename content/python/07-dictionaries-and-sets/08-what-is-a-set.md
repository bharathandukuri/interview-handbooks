---
type: concept
title: "Sets: unique elements and fast membership checks"
difficulty: easy
tags: [sets, data-structures, hashing, edge-cases]
related: [python.dictionaries-and-sets.what-is-a-dictionary]
revision:
  - "A **set** holds **unique, unordered, hashable** elements — duplicates are dropped automatically"
  - "Empty braces `{}` create an empty **dict**, NOT a set! Always use `set()` for an empty set"
  - "`.discard(x)` removes safely when absent; `.remove(x)` raises `KeyError`"
---

A **`set`** is like a dictionary with **keys only and no values**: it holds only **unique** elements in no fixed order (**unordered**, so indexing `s[0]` raises `TypeError`), and checks membership (`x in my_set`) practically instantaneously (`O(1)`).

```python
tags = {"python", "coding", "python"}   # duplicate "python" ignored!
empty_set = set()                       # MUST use set(), NOT {}!
nums = set([1, 2, 2, 3])                # removes duplicates -> 1, 2, 3

tags.add("web")                         # add element
tags.discard("missing")                 # safe even if missing (does nothing!)

print(len(tags), "web" in tags)
print(sorted(nums), 2 in nums)
print(type({}), type(empty_set))
```

The screen shows:

```text
3 True
[1, 2, 3] True
<class 'dict'> <class 'set'>
```

**Essential set rules and edge cases:**

- **No indexing or slicing:** Sets have no guaranteed order (`tags[0]` raises `TypeError: 'set' object is not subscriptable`).
- **Hashable elements only:** You cannot put a mutable `list` or `dict` inside a `set` (`{[1, 2]}` raises `TypeError: unhashable type: 'list'`).
- **`.remove(x)` vs `.discard(x)`:** Use `.discard(x)` unless a missing element should crash with `KeyError`.
- **`set("hello")`:** Converting a string gives unique characters `{'h', 'e', 'l', 'o'}`.
