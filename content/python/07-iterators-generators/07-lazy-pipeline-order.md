---
type: predict
title: "Lazy pipeline execution order"
difficulty: medium
tags: [generators, lazy, predict]
options:
  - "g1 g2 0"
  - "g1 g1 g1 g2 g2 g2 0"
  - "g1 0"
  - "Nothing prints"
answer: 0
---

```python
def gen1():
    for i in range(3):
        print("g1", end=" ")
        yield i

g2 = (x * 2 for x in gen1() if print("g2", end=" ") is None)
print(next(g2))
```

## Output

```text
g1 g2 0
```

## Explanation

Generators pull items **lazily one by one**, never running ahead:

1. Calling `gen1()` and creating `g2` executes **zero** loop iterations yet.
2. `next(g2)` requests one item from `gen1()`, which prints `g1 ` and yields `0`.
3. `g2` evaluates its `if` filter (`print("g2", end=" ")` prints `g2 ` and returns `None`, so `is None` is `True`).
4. `g2` yields `0 * 2` (`0`), and `print(next(g2))` prints `0`.

`gen1` pauses immediately after `yield 0` — iterations `1` and `2` never run unless requested.
