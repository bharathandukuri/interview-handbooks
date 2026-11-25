---
type: problem
title: "Stack pattern: Valid Parentheses and O(1) MinStack"
difficulty: easy
mostAsked: true
complexity:
  time: "O(n) for Valid Parentheses / O(1) per push, pop, top, get_min"
  space: "O(n) stack storage"
approach: "Match closing brackets against a LIFO stack of openers; maintain a parallel prefix-minimum stack in MinStack"
tags: [interviews, stack, data-structures]
related:
  [
    python.lists-and-tuples.stack-and-queue-with-lists,
    python.oop.stack-class-problem,
  ]
revision:
  - "Check `if not stack or stack.pop() != pairs[ch]: return False` on closers, and **`return not stack`** at the end"
  - "In `MinStack`, store a parallel min-so-far stack updating with `min(val, mins[-1])` so popping preserves previous minima in `O(1)`"
---

## Problem

1. **Valid Parentheses (`is_valid_brackets(s)`):** Given a string containing `()[]{}`, return `True` if brackets close in the right nested order (`"([{}])"` -> `True`, `"([)]"` -> `False`, `"("` -> `False`, `"]"` -> `False`, `""` -> `True`).
2. **`MinStack`:** Design a stack supporting `push(x)`, `pop()`, `top()`, and `get_min()` all in strict **`O(1)`** time (raise `IndexError` safely on empty `pop`/`top`/`get_min`).

## Hint

- Map each closing bracket to its opener (`PAIRS = {")": "(", "]": "[", "}": "{"}`). Any character not in `PAIRS` is pushed onto `stack`.
- At the end of `is_valid_brackets`, remember a leftover opener like `"("` leaves `stack` non-empty -> return `not stack`!
- In `MinStack`, keep two synchronized lists `_vals` and `_mins`: `_mins.append(val if not _mins else min(val, _mins[-1]))` (or push onto `_mins` only when `val <= _mins[-1]` — note `<=` is critical so duplicate minima stay tracked after one pop!).

## Solution

```python
PAIRS = {")": "(", "]": "[", "}": "{"}

def is_valid_brackets(s: str) -> bool:
    stack: list[str] = []
    for ch in s:
        if ch in PAIRS:
            if not stack or stack.pop() != PAIRS[ch]:
                return False
        else:
            stack.append(ch)
    return not stack

class MinStack:
    def __init__(self) -> None:
        self._vals: list[int] = []
        self._mins: list[int] = []

    def push(self, val: int) -> None:
        self._vals.append(val)
        if not self._mins or val <= self._mins[-1]:    # `<=` keeps duplicate minima safe!
            self._mins.append(val)

    def pop(self) -> int:
        if not self._vals:
            raise IndexError("pop from empty MinStack")
        val = self._vals.pop()
        if val == self._mins[-1]:
            self._mins.pop()
        return val

    def top(self) -> int:
        if not self._vals:
            raise IndexError("top from empty MinStack")
        return self._vals[-1]

    def get_min(self) -> int:
        if not self._mins:
            raise IndexError("get_min from empty MinStack")
        return self._mins[-1]

print("brackets:", [is_valid_brackets(x) for x in ["([{}])", "([)]", "(", "]", ""]])
ms = MinStack()
for v in [3, 1, 1, 5]:
    ms.push(v)
ms.pop(); ms.pop()
print("after popping 5 and one 1 -> min:", ms.get_min(), "| top:", ms.top())
```

## Walkthrough

Notice why **`val <= self._mins[-1]`** (rather than strict `<`) is crucial in the space-optimized `_mins` stack:

- Pushing `3, 1, 1`: `_mins` records `[3, 1, 1]`.
- When one `1` pops off, `val == self._mins[-1]` removes one `1`, leaving `[3, 1]` so `get_min()` still accurately returns `1` for the remaining copy!
- Notice also in `is_valid_brackets`, `if not stack` guards popping `"]"` cleanly without crashing on `IndexError`.
