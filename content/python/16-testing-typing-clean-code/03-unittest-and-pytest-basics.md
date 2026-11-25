---
type: concept
title: "Testing fundamentals with unittest and pytest"
difficulty: easy
mostAsked: true
tags: [testing, pytest, unittest, quality]
related:
  [python.testing-typing-clean-code.pytest-fixtures-parametrize-and-mocking]
revision:
  - "Follow **Arrange -> Act -> Assert** cleanly, testing happy paths, empty boundaries, and expected errors"
  - "`unittest` ships in Python's standard library; **`pytest`** is the industry standard with plain `assert` and clean failure diffs"
  - "Test failure behavior explicitly (`with pytest.raises(ValueError):` or `self.assertRaises(ValueError)`)"
---

Manual `print(...)` checks only verify code once while you stare at the terminal — automated unit tests prove every edge case keeps working months later after refactoring!

Both Python's built-in **`unittest`** and third-party **`pytest`** structure tests cleanly around **Arrange -> Act -> Assert**:

```python
import unittest

def clamp(value: int, low: int, high: int) -> int:
    if low > high:
        raise ValueError("low must be <= high")
    return max(low, min(value, high))

class TestClamp(unittest.TestCase):
    def test_within_bounds(self):
        self.assertEqual(clamp(5, 0, 10), 5)

    def test_edges_and_out_of_range(self):
        self.assertEqual(clamp(-3, 0, 10), 0)
        self.assertEqual(clamp(99, 0, 10), 10)

    def test_invalid_range_raises(self):
        with self.assertRaises(ValueError):
            clamp(5, 10, 0)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestClamp)
result = unittest.TextTestRunner(verbosity=0).run(suite)
print("Tests run:", result.testsRun, "| passed?", result.wasSuccessful())
```

The screen shows:

```text
Tests run: 3 | passed? True
```

**How `pytest` simplifies that same test suite (industry standard):**
In real projects (`pip install pytest`), you drop the `TestCase` class inheritance and `self.assertEqual` methods entirely — `pytest` auto-discovers `test_*.py` files and rewrites plain Python `assert` statements into rich diffs:

```text
# Equivalent pytest test file (run via: pytest -v)
import pytest

def test_within_and_outside_bounds():
    assert clamp(5, 0, 10) == 5
    assert clamp(-3, 0, 10) == 0

def test_invalid_range_raises():
    with pytest.raises(ValueError, match="low must be <= high"):
        clamp(5, 10, 0)
```

**Edge-case checklist when testing any function:**

1. Empty / zero inputs (`""`, `[]`, `{}`, `0`)
2. Boundary limits (`low == high`, off-by-one `n - 1` vs `n`)
3. Expected exceptions (bad types/negative numbers -> `assertRaises` / `pytest.raises`)
4. **Never pass non-boolean tuples to `assert`!** Writing `assert (x == 1, "bad")` is ALWAYS truthy (a 2-tuple!) and issues a `SyntaxWarning` — always write `assert x == 1, "bad"`.
