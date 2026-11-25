---
type: problem
title: "Build a Stack class with Pythonic dunder helpers"
difficulty: easy
complexity:
  time: "O(1) amortized for push, pop, peek, and len"
  space: "O(n) for n stacked elements"
approach: "Encapsulate an internal _items list so callers cannot violate LIFO order, and implement __len__, __bool__, and from_iterable"
tags: [oop, stack, data-structures, practice]
related:
  [
    python.lists-and-tuples.stack-and-queue-with-lists,
    python.oop.encapsulation-and-properties,
    python.oop.classmethod-vs-staticmethod-vs-instance,
  ]
---

## Problem

Build a clean **LIFO** (**Last-In, First-Out**) `Stack` class wrapping an internal `_items` list so users interact strictly through a clear Stack API:

- `.push(item)`: push onto the top of the stack.
- `.pop()`: remove and return the top item; raise `IndexError("pop from empty stack")` if empty.
- `.peek()`: return the top item **without** removing it; raise `IndexError("peek from empty stack")` if empty.
- `.is_empty()`: return `True` if empty, else `False`.
- Support `len(stack)` (`__len__`), `if stack:` (`__bool__` — automatically uses `__len__`!), clean `repr(stack)`, and `@classmethod from_iterable(cls, items)` to construct from any iterable.

## Hint

- Store `self._items = []` in `__init__`.
- Guard `if not self._items:` at the top of `.pop()` and `.peek()`.
- Implement `__len__(self): return len(self._items)` — Python automatically uses `__len__` when you evaluate `bool(stack)` or `if stack:`!

## Solution

```python
class Stack:
    def __init__(self):
        self._items = []

    @classmethod
    def from_iterable(cls, items):
        stack = cls()
        for item in items:
            stack.push(item)
        return stack

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        if not self._items:
            raise IndexError("peek from empty stack")
        return self._items[-1]

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)

    def __repr__(self):
        return f"Stack({self._items!r})"

s = Stack.from_iterable([10, 20])
s.push(30)
print("top:", s.peek(), "| len:", len(s), "| popped:", s.pop(), "| state:", s)
```

## Walkthrough

Notice how `@classmethod from_iterable` builds cleanly on `.push()` without sharing the caller's list object (`Stack(existing_list)` would accidentally share a mutable alias with the caller unless copied!). Also note `pop()` and `peek()` raise standard Python `IndexError` with clear domain messages when empty, and implementing `__len__` unlocks both `len(s)` and truthiness (`while s:`) for free.
