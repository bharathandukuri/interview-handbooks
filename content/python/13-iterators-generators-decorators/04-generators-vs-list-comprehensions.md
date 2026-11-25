---
type: compare
title: "Generator expressions vs list comprehensions (yield vs return)"
difficulty: easy
left: "Generator ((x for x) / yield)"
right: "List ([x for x] / return)"
tags: [generators, comprehensions, memory, performance]
related:
  [
    python.iterators-generators-decorators.generators-and-yield,
    python.comprehensions-and-sorting.tuple-comprehension-gotcha-and-readability,
  ]
---

Choosing between building a `list` up front and yielding lazily impacts memory, speed, and usability:

| Feature                    | Generator (`yield` / `(x for x in seq)`) | List (`return [...]` / `[x for x in seq]`)        |
| -------------------------- | ---------------------------------------- | ------------------------------------------------- |
| Memory footprint           | **`O(1)`** (holds only current state)    | **`O(n)`** (stores every element in RAM)          |
| When items compute         | Lazily, one at a time on `next()`        | Eagerly all at once before returning              |
| Supports indexing / `len`  | ❌ No (`gen[0]` and `len(gen)` fail!)    | ✅ Yes (`lst[0]`, `lst[-1]`, `len(lst)`)          |
| Loop multiple times?       | ❌ Single-use (exhausts after one pass)  | ✅ Reusable as many times as needed               |
| Early exit (`any`/`first`) | ✅ Stops immediately on first match!     | Evaluates everything first unless short-circuited |

## Verdict

Use a **generator** when streaming large files/pipelines, working with infinite sequences, or feeding short-circuiting consumers like `any()`, `all()`, `next()`, `sum()`, or `max()`. Use a **`list` or `tuple`** whenever callers need random indexing (`items[i]`), `len()`, sorting, or iterating over the data multiple times!
