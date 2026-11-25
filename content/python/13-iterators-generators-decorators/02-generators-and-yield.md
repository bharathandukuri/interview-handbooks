---
type: concept
title: "Generators, yield, generator expressions, and yield from"
difficulty: medium
mostAsked: true
tags: [generators, yield, lazy-evaluation, memory]
related: [python.iterators-generators-decorators.iterables-and-iterators]
revision:
  - "A function containing **`yield`** becomes a **generator function** — calling it returns a lazy iterator without running line 1 yet"
  - "Each `next()` runs until the next `yield`, pauses all local variables on the frame, and returns that yielded value"
  - "Use **`yield from`** to cleanly delegate yielding all items from another sub-iterable"
---

Writing `__iter__` and `__next__` manually takes 15 lines of class boilerplate. Any Python function that uses **`yield`** instead of `return` automatically creates a **generator** — an iterator whose execution pauses at each `yield` and resumes right where it left off on the next `next()` call!

```python
def squares_up_to(n):
    print("-> generator started!")
    for i in range(1, n + 1):
        yield i * i                       # pauses here, hands out `i * i`

gen = squares_up_to(3)                    # nothing prints yet! lazy!
print("type:", type(gen).__name__)
print("first:", next(gen))                # NOW runs up to first yield!
print("rest:", list(gen))                 # finishes remaining items [4, 9]

# Generator expression `(expr for x in ...)` — O(1) memory vs `[...]` O(n) list!
total = sum(x * x for x in range(1, 5))

# `yield from` delegates cleanly to a nested iterable:
def flatten_pairs(pairs):
    for pair in pairs:
        yield from pair                   # yields each element inside `pair`

print("sum:", total, "| flattened:", list(flatten_pairs([[1, 2], [3, 4]])))
```

The screen shows:

```text
type: generator
-> generator started!
first: 1
rest: [4, 9]
sum: 30 | flattened: [1, 2, 3, 4]
```

**Why generators shine in real production systems:**

- **Tiny constant memory (`O(1)`):** Streaming 50 million log lines through chained generators processes one line at a time without allocating giant intermediate lists in RAM!
- **Infinite sequences:** You can safely write `while True: yield n; n += 1` inside a generator because values only calculate when requested (`itertools.islice(inf_gen, 10)`).
- **`return` inside a generator:** A `return value` inside a generator ends iteration by raising `StopIteration(value)` (and `val = yield from subgen()` actually captures that returned value!). Note that writing `yield` _anywhere_ inside `def` makes the **whole function** a generator — even if `yield` sits in an unreachable `if False:` branch!
