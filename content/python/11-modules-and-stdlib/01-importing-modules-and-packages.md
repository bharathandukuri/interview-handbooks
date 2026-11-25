---
type: concept
title: "Modules, packages, import styles, and sys.modules"
difficulty: easy
mostAsked: true
tags: [modules, imports, packages, stdlib]
revision:
  - "A **module** is a `.py` file; a **package** is a directory grouping modules (usually with `__init__.py`)"
  - "Avoid `from mod import *` — prefer `import mod` or explicit `from mod import name`"
  - "Python runs a module's top-level code **once** on first import and caches the object in **`sys.modules`**"
---

As programs grow past one file, splitting code into multiple files keeps everything readable and reusable. In Python:

- A **module** is simply any `.py` file (`helpers.py`).
- A **package** is a directory containing modules (traditionally marked with an `__init__.py` file, though Python 3.3+ also supports implicit namespace packages without one).

**Four ways to import and when to use each:**

```python
import math                          # 1. Clear prefix: math.sqrt(16)
import math as m                     # 2. Alias (common for long/convention names)
from math import gcd, pi             # 3. Specific names directly into this scope
# from math import *                 # 4. AVOID: hides origin & risks overwriting names!

import sys
print("sqrt(25):", math.sqrt(25), "| m.floor:", m.floor(3.9))
print("gcd(18, 24):", gcd(18, 24), "| pi~", round(pi, 2))
print("'math' cached in sys.modules?", "math" in sys.modules)
```

The screen shows:

```text
sqrt(25): 5.0 | m.floor: 3
gcd(18, 24): 6 | pi~ 3.14
'math' cached in sys.modules? True
```

**How Python locates and caches imports (`sys.path` & `sys.modules`):**

1. **Cache check (`sys.modules`):** First Python checks the dictionary `sys.modules`. If `"math"` was already imported earlier anywhere in your process, Python reuses that cached module object immediately instead of re-reading or re-executing the file!
2. **Search order (`sys.path`):** If not cached yet, Python scans the list `sys.path` in order:
   1. Current script's directory (or working directory in interactive mode)
   2. Directories listed in the `PYTHONPATH` environment variable
   3. Built-in standard library modules (`math`, `json`, `datetime`)
   4. Installed third-party packages (`site-packages` inside your virtual environment)

**Watch out for `from mod import name` with mutable or reassigned variables:** `from config import DEBUG` binds a _local_ copy of that reference inside your file. If another module later runs `config.DEBUG = False`, your already-imported local `DEBUG` still points to `True`! Importing the module (`import config; config.DEBUG`) stays up to date automatically.
