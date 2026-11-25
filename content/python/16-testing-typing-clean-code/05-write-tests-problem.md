---
type: problem
title: "Write thorough unit tests (including edge cases) for your own helpers"
difficulty: easy
complexity:
  time: "O(k) per test case for string/number operations"
  space: "O(k)"
approach: "Cover normal inputs, empty/zero boundaries, punctuation collapse, and invalid exception cases cleanly using unittest"
tags: [testing, unittest, edge-cases, practice]
related: [python.testing-typing-clean-code.unittest-and-pytest-basics]
---

## Problem

Write a self-contained `unittest.TestCase` suite verifying two clean helper functions:

1. `apply_discount(price_cents: int, percent: float) -> int`: calculates discounted integer cents (`round(price_cents * (1 - percent / 100))`), guarding negative prices (`< 0`) and invalid percentages (`< 0` or `> 100`) with `ValueError`.
2. `slugify(text: str) -> str`: trims whitespace, lowercases, replaces runs of non-alphanumeric characters with a single `"-"`, and strips leading/trailing hyphens (e.g. `"  Hello, World!! 2026  "` -> `"hello-world-2026"`, `"---"` -> `""`).

Make sure your tests cover normal cases, `0%` / `100%` boundaries, `0` price, repeated punctuation, empty strings, and `ValueError` validation!

## Hint

- Group scenarios by behavior (`test_discount_boundaries`, `test_discount_invalid_inputs`, `test_slugify_edge_cases`).
- Use `subTest` inside loops over `(raw, expected)` pairs — just like `@pytest.mark.parametrize` — so if case #2 fails, case #3 still runs and reports cleanly!

## Solution

```python
import re
import unittest

def apply_discount(price_cents: int, percent: float) -> int:
    if price_cents < 0 or not (0 <= percent <= 100):
        raise ValueError("invalid price or discount percent")
    return round(price_cents * (1 - percent / 100))

def slugify(text: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", text.lower())
    return cleaned.strip("-")

class TestHelpers(unittest.TestCase):
    def test_discount_normal_and_boundaries(self):
        cases = [(1000, 0, 1000), (1000, 100, 0), (1000, 15, 850), (0, 50, 0)]
        for price, pct, expected in cases:
            with self.subTest(price=price, pct=pct):
                self.assertEqual(apply_discount(price, pct), expected)

    def test_discount_invalid_raises(self):
        for price, pct in [(-1, 10), (100, -5), (100, 101)]:
            with self.subTest(price=price, pct=pct):
                with self.assertRaises(ValueError):
                    apply_discount(price, pct)

    def test_slugify_edge_cases(self):
        cases = [
            ("  Hello, World!! 2026  ", "hello-world-2026"),
            ("clean-slug", "clean-slug"),
            ("---", ""),
            ("", ""),
        ]
        for raw, expected in cases:
            with self.subTest(raw=raw):
                self.assertEqual(slugify(raw), expected)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestHelpers)
res = unittest.TextTestRunner(verbosity=0).run(suite)
print("Tests run:", res.testsRun, "| passed?", res.wasSuccessful())
```

## Walkthrough

Notice how testing **boundaries (`0%`, `100%`, `price=0`)**, **messy inputs (`"---"`, `""`, extra punctuation)**, and **error conditions (`assertRaises`)** catches the bugs real users actually trigger — while `self.subTest(...)` (or `@pytest.mark.parametrize`) keeps all cases concise and shows the exact failing case on error.
