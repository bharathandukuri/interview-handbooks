---
type: concept
title: "The if __name__ == '__main__': guard and project layout"
difficulty: easy
mostAsked: true
tags: [modules, main, clean-code, packages]
related: [python.modules-and-stdlib.importing-modules-and-packages]
revision:
  - "When Python runs a file directly (`python app.py`), **`__name__`** is `'__main__'`; when imported, **`__name__`** is the module's name"
  - "Wrap script execution and tests inside **`if __name__ == '__main__':`** so importing the file stays side-effect free"
---

Every Python module automatically gets a special built-in variable called **`__name__`**:

- If you run the file directly (`python calculator.py`), Python sets `__name__` to `"__main__"`.
- If another file executes `import calculator`, Python runs `calculator.py` from top to bottom with `__name__` set to `"calculator"`.

Without a guard, calling `run_demo()` or `print(...)` at the top level of a module runs _every time someone imports a single helper function from it_! Wrapping entrypoints in `if __name__ == "__main__":` lets the same file act cleanly as **both** an importable library and a runnable script:

```python
import math

def circle_area(radius):
    if radius < 0:
        raise ValueError("radius must be >= 0")
    return math.pi * radius * radius

def main():
    print(f"Area (r=3): {circle_area(3):.2f}")

# Only runs when executed directly, NOT when another module imports `circle_area`:
if __name__ == "__main__":
    main()
```

The screen shows:

```text
Area (r=3): 28.27
```

**Why `if __name__ == "__main__":` matters even more later:**

- **Testing & tooling:** Test runners like `pytest` import your files to inspect functions — unguarded top-level script calls would execute database writes or CLI loops during test collection!
- **Multiprocessing (Chapter 15):** On Windows and macOS, worker processes re-import your main script; forgetting `if __name__ == "__main__":` launches an infinite chain of child processes and crashes!

**Clean multi-file package layout (`src/` layout):**

```text
my_project/
├── pyproject.toml
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── cli.py          # uses: if __name__ == "__main__":
│       └── utils.py
└── tests/
    └── test_utils.py
```

Inside `myapp/cli.py`, prefer explicit absolute imports (`from myapp import utils`) or clear package-relative imports (`from . import utils` — note relative imports work _only_ inside packages run with `python -m myapp.cli`, not when running `python src/myapp/cli.py` directly!).
