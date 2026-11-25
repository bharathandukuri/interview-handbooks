---
type: concept
title: "Modules, packages, and `import` mechanics"
difficulty: easy
mostAsked: true
tags: [modules, imports, packaging]
revision:
  - "Python caches imported modules in `sys.modules` — a module's top-level code runs only once"
  - 'Guard script entry points with `if __name__ == "__main__":`'
  - "Prefer explicit absolute imports; define `__all__` to control `from pkg import *`"
---

Any `.py` file is a **module**; a directory of modules (optionally with `__init__.py`, or PEP 420 namespace package) is a **package**.

```python
import math                    # imports module namespace -> math.sqrt(16)
from pathlib import Path       # binds Path directly into local namespace
from .utils import clean       # relative import (only inside packages)

if __name__ == "__main__":
    # Runs only when executed directly (`python app.py`), NOT when imported
    main()
```

**How `import` works under the hood:**

1. Check `sys.modules` cache — if already loaded, return the cached module immediately.
2. Otherwise, search `sys.path` (current directory, `PYTHONPATH`, installed `site-packages`).
3. Execute top-level statements once and store in `sys.modules`.

**Package tips:** Use `__all__ = ["PublicClass", "helper"]` in `__init__.py` to document your public API, and avoid `from mod import *` in application code because it pollutes namespaces and breaks static linters.
