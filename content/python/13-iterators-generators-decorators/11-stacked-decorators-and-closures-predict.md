---
type: predict
title: "Stacked decorators: definition order vs execution order"
difficulty: hard
mostAsked: true
tags: [decorators, closures, order, trace]
related: [python.iterators-generators-decorators.decorators-and-functools-wraps]
revision:
  - "Decorators stack like `fn = outer(inner(fn))` — **applied bottom-up** at `def` time, **called top-down** when running `fn()`"
options:
  - "apply inner\napply outer\nbefore outer\nbefore inner\nHELLO\nafter inner\nafter outer"
  - "apply outer\napply inner\nbefore outer\nbefore inner\nHELLO\nafter inner\nafter outer"
  - "apply inner\napply outer\nbefore inner\nbefore outer\nHELLO\nafter outer\nafter inner"
  - "before outer\nbefore inner\nHELLO\nafter inner\nafter outer"
answer: 0
---

```python
from functools import wraps

def outer(fn):
    print("apply outer")
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print("before outer")
        res = fn(*args, **kwargs)
        print("after outer")
        return res
    return wrapper

def inner(fn):
    print("apply inner")
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print("before inner")
        res = fn(*args, **kwargs)
        print("after inner")
        return res
    return wrapper

@outer
@inner
def hello():
    print("HELLO")

hello()
```

## Output

```text
apply inner
apply outer
before outer
before inner
HELLO
after inner
after outer
```

## Explanation

Remember that stacked decorators expand directly into nested calls:

```python
hello = outer(inner(hello))
```

1. **Definition time (bottom-up):** Python evaluates `inner(hello)` first (`apply inner`), then passes its returned wrapper into `outer(...)` (`apply outer`)! Both `"apply ..."` lines print immediately when `def` executes, **before** `hello()` is even called!
2. **Call time (top-down / outside-in):** `hello` now points to `outer`'s wrapper. Calling `hello()` runs:
   - `"before outer"`
   - calls `inner`'s wrapper -> `"before inner"`
   - calls original `hello()` -> `"HELLO"`
   - finishes `inner` -> `"after inner"`
   - finishes `outer` -> `"after outer"`
