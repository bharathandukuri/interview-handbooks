---
type: concept
title: "Bytecode, __pycache__ (.pyc), and dis.dis()"
difficulty: medium
tags: [internals, bytecode, dis, compiler]
related: [python.getting-started.is-python-compiled-or-interpreted]
---

Recall from Chapter 01 that CPython **compiles** your `.py` text into compact numeric **bytecode** instructions first, caches that compiled bytecode for imported modules inside **`__pycache__/*.pyc`**, and executes those bytecode instructions one by one inside Python's stack-based **Virtual Machine** (**PVM**).

You can inspect the exact bytecode instructions generated for any function using the standard library **`dis`** module:

```python
import dis

def add_tax(price, tax=10):
    return price + tax

print("Raw bytecode length:", len(add_tax.__code__.co_code), "bytes")
dis.dis(add_tax)
```

The screen shows:

```text
Raw bytecode length: 18 bytes
  3           RESUME                   0

  4           LOAD_FAST_BORROW_LOAD_FAST_BORROW 1 (price, tax)
              BINARY_OP                0 (+)
              RETURN_VALUE
```

_(Exact superinstruction names like `LOAD_FAST_LOAD_FAST` may vary slightly across CPython 3.11–3.14 versions, while the stack-based load -> op -> return flow stays the same!)_

**Why understanding bytecode explains real Python behavior:**

- **Stack machine execution:** Notice `add_tax` pushes `price` and `tax` onto the frame's evaluation stack, combines the top two values with `BINARY_OP (+)`, and returns the result.
- **Why `.pyc` only speeds up startup (not runtime loop speed):** Importing a large module reads cached `.pyc` directly instead of re-parsing `.py` source text. Runtime speed stays identical once compiled!
- **Bytecode makes tricky puzzles crystal clear:** Later in this chapter (`t = ([1],); t[0] += [2]`), seeing `LOAD_SUBSCR -> BINARY_OP (+=) -> STORE_SUBSCR` explains **why** `t[0]` gets mutated _before_ tuple item assignment fails!
