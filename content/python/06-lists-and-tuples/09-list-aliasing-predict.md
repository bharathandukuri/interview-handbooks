---
type: predict
title: "Trace list aliases, slices, and nested lists"
difficulty: medium
mostAsked: true
tags: [lists, aliasing, copying, predict]
related: [python.lists-and-tuples.aliasing-and-copying-lists]
revision:
  - "`b = a` shares changes; `c = a[:]` isolates top-level edits; `[[]] * 2` shares inner lists"
options:
  - "a=[1, 2], b=[1, 2, 3], c=[99, 2], grid=[[7], [7]]"
  - "a=[1, 2, 3], b=[1, 2, 3], c=[99, 2], grid=[[7], [0]]"
  - "a=[1, 2, 3], b=[1, 2, 3], c=[99, 2], grid=[[7], [7]]"
  - "a=[99, 2, 3], b=[99, 2, 3], c=[99, 2], grid=[[7], [7]]"
answer: 2
---

Trace carefully which variables point to the same list in memory and which point to a copy!

```python
a = [1, 2]
b = a
c = a[:]
a.append(3)
c[0] = 99

grid = [[0]] * 2
grid[0][0] = 7
print(a, b, c, grid)
```

## Output

```text
[1, 2, 3] [1, 2, 3] [99, 2] [[7], [7]]
```

## Explanation

1. **`b = a`:** `a` and `b` are aliases for the same list. So `a.append(3)` changes **both** `a` and `b` to `[1, 2, 3]`.
2. **`c = a[:]`:** `c` is a shallow copy made _before_ `a.append(3)`, so `c` starts as its own `[1, 2]`. Setting `c[0] = 99` updates only `c` -> `[99, 2]`.
3. **`grid = [[0]] * 2`:** Multiplying a list of lists duplicates the **reference** to `[0]`, so `grid[0]` and `grid[1]` are the exact same inner list! Setting `grid[0][0] = 7` makes **both** rows `[7]`.
