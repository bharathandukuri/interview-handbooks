---
type: concept
title: "CPython bytecode, `__pycache__`, and `dis.dis()`"
difficulty: medium
tags: [cpython, bytecode, internals]
---

CPython is not purely line-by-line interpreted: it compiles `.py` source to an AST, compiles the AST to **stack-based bytecode**, caches it in `__pycache__/*.pyc`, and executes it in CPython's main C evaluation loop.

```python
import dis

def add(a: int, b: int) -> int:
    return a + b

dis.dis(add)
# LOAD_FAST 0 (a) -> LOAD_FAST 1 (b) -> BINARY_OP 0 (+) -> RETURN_VALUE
```

**Why knowing bytecode helps:**

- **Faster locals (`LOAD_FAST`):** Local variables live in a fixed C array by index, making local lookups noticeably faster than global lookups (`LOAD_GLOBAL`, a dict lookup).
- **Peephole & constant folding:** Expressions like `24 * 60 * 60` are folded into `86400` at compile time.
- **Python 3.11+ Specializing Adaptive Interpreter:** CPython rewrites hot bytecode instructions in place (e.g. `BINARY_OP_ADD_INT`) for ~25% speedups without changing semantics.
