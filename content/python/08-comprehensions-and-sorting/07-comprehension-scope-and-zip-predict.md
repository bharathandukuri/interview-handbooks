---
type: predict
title: "Comprehension scope, zip truncation, and dict inversion"
difficulty: medium
tags: [comprehensions, zip, dicts, scoping, predict]
related:
  [
    python.comprehensions-and-sorting.list-comprehensions,
    python.comprehensions-and-sorting.dict-and-set-comprehensions,
    python.comprehensions-and-sorting.enumerate-and-zip,
  ]
revision:
  - "Python 3 comprehensions keep their own scope (`n` outside stays unchanged)"
  - "`zip` stops at the shortest iterable; dict comprehensions overwrite duplicate keys"
options:
  - "2, [('a', 1), ('b', 2), ('c', None)], {3: 'cat'}"
  - "99, [('a', 1), ('b', 2)], {3: 'dog'}"
  - "99, [('a', 1), ('b', 2)], {3: 'cat'}"
  - "2, [('a', 1), ('b', 2)], {3: 'dog'}"
answer: 1
---

Trace variable scope isolation, `zip()`, and dict key collisions all at once!

```python
n = 99
squares = [n * n for n in range(3)]
paired = list(zip("abc", [1, 2]))
flipped = {len(w): w for w in ["cat", "dog"]}

print(n, paired, flipped)
```

## Output

```text
99 [('a', 1), ('b', 2)] {3: 'dog'}
```

## Explanation

1. **`n = 99` vs `[n * n for n in range(3)]`:** In Python 3, comprehensions have their own isolated scope, so `n` inside the comprehension does **not** overwrite the outer `n = 99`!
2. **`list(zip("abc", [1, 2]))`:** `"abc"` has 3 items and `[1, 2]` has 2 items. Without `strict=True`, `zip` stops at the shortest length (`2`), dropping `'c'` and yielding `[('a', 1), ('b', 2)]`.
3. **`{len(w): w for w in ["cat", "dog"]}`:** Both `"cat"` and `"dog"` have length `3`. Dict comprehensions insert keys left to right, so `{3: 'cat'}` gets overwritten by **`{3: 'dog'}`**.
