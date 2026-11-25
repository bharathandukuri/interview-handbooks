---
type: pitfall
title: "Float precision and truthiness traps"
difficulty: easy
tags: [basics, floats, pitfalls]
---

## The trap

```python
# 1. Binary floating-point representation error
print(0.1 + 0.2 == 0.3)   # False! (0.30000000000000004)

# 2. Treating `0` or `""` the same as `None`
def set_port(port=None):
    port = port or 8080   # BUG: port=0 gets overwritten with 8080!
    return port
```

## The fix

```python
import math
from decimal import Decimal

print(math.isclose(0.1 + 0.2, 0.3))              # True
print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))  # True

def set_port(port=None):
    if port is None:      # explicit None check preserves 0
        port = 8080
    return port
```

## Why it happens

1. Binary `float` cannot represent base-10 fractions like `0.1` or `0.2` exactly in 64 bits. Use `math.isclose()` for tolerances or `Decimal` with string inputs for money and exact math.
2. `or` falls back on _any_ falsy value (`0`, `False`, `""`), not just `None`. Always check `is None` when `0` or empty strings are valid inputs.
