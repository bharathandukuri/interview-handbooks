---
type: concept
title: "Loops: `for`, `while`, `range`, `enumerate`, and `zip`"
difficulty: easy
mostAsked: true
tags: [control-flow, loops, iteration]
revision:
  - "Iterate directly over items (`for x in items`), use `enumerate()` when you need indices"
  - "`zip(a, b, strict=True)` (3.10+) fails fast if iterables have different lengths"
  - "Loop `else:` runs only if the loop finished normally without hitting `break`"
---

`for` loops iterate over **any iterable** directly — avoid `for i in range(len(items)):` unless mutating by index.

```python
names = ["Ada", "Grace", "Linus"]
for idx, name in enumerate(names, start=1):
    print(f"{idx}. {name}")

scores = [98, 95, 99]
for name, score in zip(names, scores, strict=True):
    print(f"{name}: {score}")
```

**`while`, `break`, `continue`, `pass`, and `for...else`:**

- `break` exits the innermost loop immediately; `continue` skips to the next iteration.
- `pass` is a no-op placeholder where syntax requires a block.
- `else:` after `for`/`while` runs **only if `break` was never executed** — handy for search loops without a `found = False` flag:

```python
for n in nums:
    if n < 0:
        break
else:
    print("All numbers were non-negative")
```
