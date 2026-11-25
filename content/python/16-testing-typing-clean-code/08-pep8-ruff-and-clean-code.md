---
type: concept
title: "PEP 8 conventions, ruff/mypy automation, and clean-code idioms"
difficulty: easy
tags: [clean-code, pep8, ruff, mypy, style]
related:
  [
    python.functions.return-early-and-multiple-values,
    python.testing-typing-clean-code.type-hints-basics-and-unions,
  ]
---

Consistent code reads faster during code reviews and reduces team debates from 20 minutes down to 0 seconds. **PEP 8** is Python's official style specification — and modern tools enforce it automatically on save!

**Core PEP 8 & Pythonic clean-code rules:**

- **Naming conventions:**
  - `snake_case` for variables, functions, methods, and module filenames (`calc_total`)
  - `PascalCase` (`CapWords`) for classes and custom exceptions (`BankAccount`, `ValueError`)
  - `UPPER_SNAKE_CASE` for module-level constants (`MAX_RETRIES = 3`)
- **Formatting:** 4 spaces per indentation level (never tabs), <= 88 or 79–100 chars per line, 2 blank lines around top-level classes/functions.
- **Idiomatic Python patterns:**
  - **Flatten nesting with guard clauses:** handle invalid/edge cases and `return` early instead of writing 4 levels of nested `if`/`else`.
  - **Prefer `is None` / `if not items:` cleanly:** remember `not items` checks empty sequence; use `if items is None:` when `[]` vs `None` behave differently!
  - **Descriptive docstrings & pure functions:** keep side effects (printing, writing DB) separate from core business calculations so logic stays trivially testable.

**Essential automated quality stack:**

```bash
# Modern unified linter + formatter (replaces flake8 + isort + black at Rust speed!):
ruff check . --fix
ruff format .

# Static type checking before running code:
mypy src/ tests/
# (or Pyright / VS Code Pylance strict mode)
```

Putting **`ruff`** + **`mypy`** + **`pytest`** in CI ensures every pull request stays cleanly formatted, free of unused imports or mutable-default bugs (`B006` in Ruff!), and type-checked automatically.
