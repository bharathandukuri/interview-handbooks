---
type: pitfall
title: "Bare `except:` and circular imports"
difficulty: medium
tags: [exceptions, imports, pitfalls]
---

## The trap

```python
# Trap 1: Bare `except:` catches Ctrl+C (KeyboardInterrupt) and sys.exit()!
try:
    poll_queue()
except:
    pass

# Trap 2: Circular import at module top-level
# a.py -> `from b import B`
# b.py -> `from a import A`  → ImportError: partially initialized module
```

## The fix

```python
# Fix 1: Always catch `Exception` (or specific subclasses)
try:
    poll_queue()
except (TimeoutError, ConnectionError) as exc:
    logger.warning("Retryable error: %s", exc)

# Fix 2: Defer import inside function, use `TYPE_CHECKING`, or extract shared module
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from b import B   # only imported by mypy/pyright, zero runtime cycle!
```

## Why it happens

`KeyboardInterrupt` and `SystemExit` inherit from `BaseException`, not `Exception`. A bare `except:` swallows them, making processes impossible to stop cleanly. Circular imports fail because Python executes module A top-to-bottom; when A imports B before defining `class A`, B cannot find `A` in `sys.modules["a"]`.
