---
type: concept
title: "Custom context managers (__enter__/__exit__, @contextmanager, ExitStack)"
difficulty: medium
mostAsked: true
tags: [context-managers, with, contextlib, resources]
related:
  [
    python.errors-and-files.reading-and-writing-files-with,
    python.iterators-generators-decorators.generators-and-yield,
  ]
revision:
  - "The `with` protocol calls **`__enter__()`** before the block and guarantees **`__exit__(exc_type, exc_val, exc_tb)`** runs afterward"
  - "`__exit__` returning **`True`** suppresses the exception; returning `False` or `None` lets it propagate normally"
  - "With `@contextlib.contextmanager`, ALWAYS wrap `yield` in **`try ... finally:`** so exceptions still run cleanup!"
---

Files (`with open(...)`) are only one example of a **context manager**. Any resource that needs paired setup and guaranteed teardown (database connections, locks, temporary directories, timers) can implement Python's `with` protocol in **two** ways:

```python
from contextlib import ExitStack, contextmanager

# 1. Class-based context manager (`__enter__` + `__exit__`)
class ManagedStep:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"enter {self.name}")
        return self                              # bound to `as step`

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"exit  {self.name} (err={exc_type.__name__ if exc_type else None})")
        return False                             # False/None = do NOT swallow exceptions!

# 2. Generator-based context manager with @contextmanager (MUST use try/finally around yield!)
@contextmanager
def prefix_tag(tag):
    print(f"start <{tag}>")
    try:
        yield tag.upper()                        # pauses here during `with` body!
    finally:
        print(f"end   </{tag}>")                 # ALWAYS runs even if body raised!

with ManagedStep("job") as step:
    with prefix_tag("sql") as label:
        print("running inside:", step.name, label)

# 3. ExitStack handles a DYNAMIC number of context managers cleanly!
with ExitStack() as stack:
    tags = [stack.enter_context(prefix_tag(t)) for t in ("a", "b")]
    print("opened:", tags)
```

The screen shows:

```text
enter job
start <sql>
running inside: job SQL
end   </sql>
exit  job (err=None)
start <a>
start <b>
opened: ['A', 'B']
end   </b>
end   </a>
```

**Important context manager rules & edge cases:**

- **Always wrap `yield` in `try ... finally:` inside `@contextmanager`:** Without `try/finally`, an exception inside the caller's `with` body gets re-thrown right at the `yield` line inside `prefix_tag()`, skipping every cleanup line after `yield`!
- **Exception suppression (`return True` trap):** If `__exit__` returns a truthy value (`True`), Python **silently swallows** any exception raised inside the `with` block and resumes execution _after_ the `with` block! Almost all context managers should return `False` (or omit `return`, returning `None`).
- **`ExitStack` cleans up in LIFO order:** Notice `"b"` ended before `"a"` cleanly! That solves opening `N` files dynamically (`for path in paths: stack.enter_context(open(path, ...))`) without deeply nested `with` blocks.
