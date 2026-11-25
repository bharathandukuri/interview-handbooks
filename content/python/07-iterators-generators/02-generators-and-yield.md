---
type: concept
title: "Generators, `yield`, and `yield from`"
difficulty: medium
mostAsked: true
tags: [generators, yield, memory]
revision:
  - "`yield` pauses the function and saves its local stack frame between `next()` calls"
  - "Generator expressions `(x * 2 for x in nums)` evaluate lazily in O(1) memory"
  - "`yield from subgen` delegates directly to a nested iterable/generator"
---

A **generator function** uses `yield` instead of `return`. Calling it doesn't run the body immediately — it returns a generator object that computes values **lazily on demand**.

```python
def fibonacci():
    a, b = 0, 1
    while True:                  # infinite stream in O(1) memory!
        yield a
        a, b = b, a + b

# Generator expression (parentheses instead of brackets)
squares = (n * n for n in range(1_000_000))
```

**`yield from` (delegation):** Flattens nested iteration cleanly and forwards `.send()` / `.throw()` / `.close()` calls:

```python
def flatten(nested):
    for sub in nested:
        yield from sub           # replaces: for item in sub: yield item
```

Generators are ideal for streaming large files, infinite sequences, and multi-stage data pipelines where materializing intermediate lists would waste RAM.
