---
type: question
title: "Testing, typing, logging, and Python security best practices"
difficulty: medium
mostAsked: true
tags: [testing, typing, pytest, security, interviews]
related:
  [
    python.testing-typing-clean-code.type-hints-basics-and-unions,
    python.testing-typing-clean-code.advanced-typing-protocol-generics,
    python.testing-typing-clean-code.pytest-fixtures-parametrize-and-mocking,
    python.testing-typing-clean-code.security-pitfalls-eval-pickle-sql,
  ]
revision:
  - "Type hints aid static checkers (`mypy`/`pyright`) without runtime enforcement; use `Protocol` for structural typing and `Sequence` for covariant inputs"
  - "`pytest` shines via `parametrize`, `yield` fixtures, `tmp_path`, `monkeypatch`, and `patch(..., autospec=True)`"
  - "Use `logging` (`logger.info('x %s', val)`), profile before optimizing (`cProfile`/`tracemalloc`), and ban `eval`, `pickle`, and f-string SQL on untrusted input"
---

## Answer

Production engineering interviews combine Python correctness with team maintainability and safety:

1. **Static Typing (`mypy` / `pyright`):**
   - Python ignores annotations at runtime (validate external inputs separately with explicit checks or Pydantic). Prefer modern `list[int]`, `str | None`, and Python 3.12 PEP 695 generics (`def f[T](x: Sequence[T]) -> T:`). Understand `Any` (turns off checking) vs `object` (requires narrowing), `Protocol` (structural duck typing), and parameter variance (`Sequence` accepts `list[Dog]`, invariant `list[Animal]` rejects it).
2. **`pytest` & Isolation:**
   - Replace repetitive tests with `@pytest.mark.parametrize`, share clean setup/teardown with `@pytest.fixture` + `yield`, isolate I/O with `tmp_path` and `monkeypatch`, and always pass **`autospec=True`** to `unittest.mock.patch` (patching at the _lookup site_).
3. **Observability & Profiling:**
   - Replace production `print()` with `logging` (`logger.info("User %s", uid)` lazy formatting + `logger.exception`), inspect crashes with `breakpoint()`, and measure bottlenecks via `timeit`, `cProfile`, and `tracemalloc`.
4. **Security Hygiene:**
   - Never run `eval()`, `exec()`, or `pickle.loads()` on untrusted payloads (`json` or `ast.literal_eval`), always use parameterized SQL (`?` / `%s`), and keep `subprocess.run([...])` with `shell=False`.

**A short answer for an interview:** Pair modern type hints (`Protocol`, covariant `Sequence`, `| None`) checked by `mypy`/`ruff` with isolated `pytest` suites (`parametrize`, `tmp_path`, `autospec=True` mocks), structured lazy `logging`, measurement-driven profiling, and zero `eval`/`pickle`/string-interpolated SQL on untrusted input.

## Why interviewers ask

Senior roles require writing code other engineers can refactor safely months later without breaking APIs, leaking test artifacts, logging sensitive/noisy garbage, or introducing RCE/SQL injection holes.

## Follow-ups

- **"Why must `unittest.mock.patch` target `module_under_test.func` rather than `source_module.func`?"** When `module_under_test` executes `from source_module import func`, it creates its own local binding to `func`. Patching `source_module.func` leaves `module_under_test.func` pointing to the real unpatched function!
- **"Why does `ruff` catch bugs that human code reviewers miss?"** Linting rules like `B006` (mutable defaults), `B023` (late-binding loop closures), `S102`/`S301` (`exec`/`pickle`), and `F401` (unused imports) detect whole classes of silent runtime traps instantly before tests even start.
