---
type: concept
title: "Tuple unpacking and extended star (*) unpacking"
difficulty: easy
mostAsked: true
tags: [tuples, unpacking, syntax, edge-cases]
related:
  [
    python.variables-and-types.assign-many-at-once,
    python.lists-and-tuples.what-is-a-tuple,
  ]
revision:
  - "**Unpacking** pulls elements straight into named variables: `x, y = (10, 20)`"
  - "**Extended unpacking (`*`)** grabs leftover values into a **list**: `first, *mid, last = items`"
  - "If the left count does not match the sequence length (without `*`), Python raises `ValueError`"
---

Remember `x, y = 1, 2` and `a, b = b, a` from Chapter 2? That works because of **sequence unpacking** — pulling items from any tuple, list, or string straight into variables on the left.

```python
point = (10, 20, 30)
x, y, z = point
print(x, y, z)

scores = [98, 92, 85, 79, 71]
top, *middle, bottom = scores     # `*middle` captures leftovers into a list!
print("top:", top, "mid:", middle, "low:", bottom)

head, *rest = [42]                # edge case: `*rest` can match ZERO items -> []
print(head, rest)
```

The screen shows:

```text
10 20 30
top: 98 mid: [92, 85, 79] low: 71
42 []
```

**Key rules and edge cases:**

- **Starred target (`*`) always produces a `list`:** Even when unpacking a tuple `(1, 2, 3)`, `a, *b = (1, 2, 3)` sets `b` to the **list** `[2, 3]`, or `[]` if zero items remain!
- **Only one `*` allowed:** Writing two starred names (`*a, *b = items`) raises `SyntaxError`.
- **Ignoring values with `_` or `*_`:** Write `name, _, role = row` or `first, *_ = items` to signal intentionally unused items.
- **Count mismatch:** `x, y = (1, 2, 3)` or `x, y = (1,)` stops with `ValueError: too many/not enough values to unpack`.
