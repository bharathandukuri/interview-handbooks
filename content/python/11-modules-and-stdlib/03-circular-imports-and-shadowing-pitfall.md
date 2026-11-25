---
type: pitfall
title: "Circular imports and shadowing standard library module names"
difficulty: medium
mostAsked: true
tags: [modules, imports, gotchas, debugging]
related: [python.modules-and-stdlib.importing-modules-and-packages]
revision:
  - "Never name your own file after a standard-library module (`random.py`, `json.py`, `email.py`) — your folder comes **first** in `sys.path`"
  - "**Circular imports** (`a` imports `b` while `b` imports `a`) fail when top-level code references names not yet defined in the half-loaded module"
---

## The trap

```python
# Trap 1 (filename shadowing): imagine saving your file as `random.py`:
# import random
# print(random.randint(1, 6))
# -> AttributeError: partially initialized module 'random' has no attribute 'randint'

# Trap 2 (circular import simulation):
# module_a.py:                       # module_b.py:
#   from module_b import helper_b    #   from module_a import helper_a  <-- FAILS!
#   def helper_a(): ...              #   `helper_a` hasn't executed yet!
```

## The fix

```python
# Fix 1: Name files specifically for your domain (e.g. `dice_game.py`, NOT `random.py`).
# Fix 2: Move shared utilities into a third lower-level module (`common.py`),
#        so dependencies flow one way without cycles!

# Simulating clean acyclic dependency layering:
def shared_rule(x):                  # lives in common.py
    return x * 2

def feature_a(x):                    # imports shared_rule, NOT feature_b
    return shared_rule(x) + 1

def feature_b(x):                    # imports feature_a + shared_rule
    return feature_a(x) + 10

print(feature_b(5))
```

## Why it happens

1. **Filename shadowing (`sys.path[0]`):** Python searches your current script directory **before** the standard library! If you create a file named `json.py`, `email.py`, or `typing.py`, `import json` loads _your_ file instead of Python's built-in module — causing mysterious `AttributeError` failures inside third-party packages too. Always check for old `.py` or `__pycache__` files in the folder!
2. **Circular imports (`partially initialized module`):** When `a.py` hits `from b import helper_b`, Python pauses `a.py` mid-file and starts running `b.py`. If `b.py` immediately tries `from a import helper_a`, `a.py` is already registered in `sys.modules` as an empty/half-run module whose `def helper_a` line has not executed yet -> **`ImportError: cannot import name 'helper_a' from partially initialized module 'a'`**! Fix circular imports by factoring shared pieces into a third file (`common.py`), or (last resort) moving a local import inside the function that needs it.
