---
type: concept
title: "Lazy iteration and caching with itertools and functools"
difficulty: medium
mostAsked: true
tags: [itertools, functools, memoization, stdlib]
related:
  [
    python.functions.fibonacci-and-memoization,
    python.modules-and-stdlib.defaultdict-and-itertools-predict,
  ]
revision:
  - "`itertools` helpers produce values lazily one by one without building huge temporary lists"
  - "`itertools.groupby` only groups **adjacent** equal items — always **sort** first if duplicates are scattered!"
  - "`@functools.cache` / `@lru_cache` adds instant memoization to functions with **hashable** arguments"
---

Two power-user modules save hundreds of lines of manual loop and cache boilerplate: **`itertools`** and **`functools`**.

```python
from functools import cache, partial
from itertools import chain, combinations, groupby, islice

# 1. itertools: chain, islice, combinations, groupby
flat = list(chain([1, 2], [3, 4]))
first_two = list(islice(range(1_000_000), 2))
pairs = list(combinations(["A", "B", "C"], 2))

# groupby merges ADJACENT matches only — sort by the same key first!
words = sorted(["apple", "banana", "apricot", "blueberry"], key=lambda w: w[0])
grouped = {k: list(grp) for k, grp in groupby(words, key=lambda w: w[0])}
print("flat:", flat, "| pairs:", pairs)
print("grouped:", grouped)

# 2. functools: partial pre-fills arguments; @cache memoizes calls automatically!
base2 = partial(int, base=2)                 # creates int(text, base=2)

@cache                                       # decorator syntax explained in Ch 13!
def fib(n):
    return n if n <= 1 else fib(n - 1) + fib(n - 2)

print("binary 1011:", base2("1011"), "| fib(40):", fib(40), "| first_two:", first_two)
```

The screen shows:

```text
flat: [1, 2, 3, 4] | pairs: [('A', 'B'), ('A', 'C'), ('B', 'C')]
grouped: {'a': ['apple', 'apricot'], 'b': ['banana', 'blueberry']}
binary 1011: 11 | fib(40): 102334155 | first_two: [0, 1]
```

**Important edge cases to know:**

- **`groupby` traps:**
  1. Unsorted data like `["a", "b", "a"]` creates **three** separate groups (`'a'`, `'b'`, `'a'`) because `groupby` checks consecutive keys like SQL/Unix `uniq`!
  2. Each `grp` sub-iterator shares the underlying stream — consume it immediately with `list(grp)` inside the loop before advancing to the next group, otherwise it silently empties!
- **`@cache` vs `@lru_cache(maxsize=128)`:** `@cache` (Python 3.9+) keeps **every** result forever (great for pure math/DP, risky for long-running web servers unless bounded with `@lru_cache(maxsize=1024)`!). Because results are stored in an internal dictionary, all arguments **must be hashable** (passing a `list` raises `TypeError: unhashable type: 'list'`). Note also `fib.cache_info()` lets you inspect cache hits and misses!
