---
type: concept
title: "Using a list as a stack (and why front operations are slow)"
difficulty: medium
tags: [lists, stack, complexity, data-structures]
related: [python.lists-and-tuples.list-methods-add-remove-find]
revision:
  - "A **stack** works **Last-In, First-Out (LIFO)**: use `.append(x)` and `.pop()` at the tail in instant `O(1)` time"
  - "`insert(0, x)` and `pop(0)` are slow on big lists (`O(n)`) because every remaining item shifts one slot"
---

Because a Python `list` stores elements side by side in a contiguous memory block (**dynamic array**), operations at the **back** behave completely differently from operations at the **front**:

```python
# Using a list as a fast LIFO Stack (Last-In, First-Out):
history = []
history.append("page1")     # push onto top -> O(1)
history.append("page2")     # push onto top -> O(1)
last = history.pop()        # pop from top -> "page2" in O(1)!
print(history, "last:", last)
```

The screen shows:

```text
['page1'] last: page2
```

**Why front operations (`insert(0, x)`, `pop(0)`) are slow (`O(n)`):**

- **At the end (`.append()`, `.pop()`):** Python keeps a little spare capacity at the back of the list, so adding or removing at the end takes constant **`O(1)`** time no matter how big the list grows.
- **At the front (`.insert(0, x)`, `.pop(0)`):** Removing index `0` forces Python to slide **every remaining item** (`1, 2, ..., n-1`) left by one slot! On a list of 1,000,000 items, one `pop(0)` moves 999,999 pointers (`O(n)`).

:::tip[When you need a fast queue]
In Chapter 11 (Standard Library), you will learn **`collections.deque`**, which gives instant `O(1)` adds and pops from **both** front (`appendleft`/`popleft`) and back!
:::
