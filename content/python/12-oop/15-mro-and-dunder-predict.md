---
type: predict
title: "Diamond inheritance trace with super().__init__"
difficulty: hard
mostAsked: true
tags: [oop, mro, super, inheritance, trace]
related: [python.oop.mro-and-multiple-inheritance]
revision:
  - "In `D(B, C)`, `D.__mro__` is `[D, B, C, A, object]`"
  - "`super()` follows `D.__mro__` step by step, so `B`'s `super()` jumps to **`C`**, not `A`!"
options:
  - "D -> B -> C -> A"
  - "D -> B -> A -> C -> A"
  - "D -> B -> A -> C"
  - "D -> C -> B -> A"
answer: 0
---

```python
class A:
    def __init__(self, log):
        log.append("A")

class B(A):
    def __init__(self, log):
        log.append("B")
        super().__init__(log)

class C(A):
    def __init__(self, log):
        log.append("C")
        super().__init__(log)

class D(B, C):
    def __init__(self, log):
        log.append("D")
        super().__init__(log)

trace = []
D(trace)
print(" -> ".join(trace))
```

## Output

```text
D -> B -> C -> A
```

## Explanation

Follow `D.__mro__` (`D -> B -> C -> A -> object`):

1. `D(trace)` starts `D.__init__`, appends `"D"`, and calls `super().__init__(log)` -> moves to next in MRO: **`B`**.
2. `B.__init__` appends `"B"` and calls `super().__init__(log)` -> moves to next in **`D.__mro__`**: **`C`** (not `A`!).
3. `C.__init__` appends `"C"` and calls `super().__init__(log)` -> moves to **`A`**.
4. `A.__init__` appends `"A"` and returns cleanly, having initialized the base class **exactly once**!
