---
type: problem
title: "Chapter challenge: Refactor messy legacy code into clean, typed Python"
difficulty: medium
complexity:
  time: "O(n) over n order items"
  space: "O(n) for summarized output or O(1) extra for aggregation"
approach: "Replace mutable defaults, bare except, float money bugs, and deep nesting with dataclass(frozen=True, slots=True), early guard clauses, exact integer cents, and type hints"
tags: [clean-code, refactoring, typing, testing, interview]
related:
  [
    python.testing-typing-clean-code.pep8-ruff-and-clean-code,
    python.testing-typing-clean-code.type-hints-basics-and-unions,
    python.oop.dataclasses-and-enums,
  ]
---

## Problem

You inherit this buggy legacy function:

```python
def process(items, seen=[]):
    total = 0
    for i in items:
        try:
            if i["qty"] > 0:
                if i["sku"] not in seen:
                    seen.append(i["sku"])
                    total = total + i["cents"] * i["qty"]
        except:
            pass
    return total
```

Spot **every** flaw (`seen=[]`, bare `except:`, silent swallowing, O(n^2) `not in seen` list scan, no types, skipped invalid validation) and rewrite it cleanly as typed, edge-case-safe Python (`dedupe_order_total(items: Sequence[OrderLine]) -> int`) with `OrderLine` dataclass and crisp unit assertions!

## Hint

- Define `@dataclass(frozen=True, slots=True)` `OrderLine(sku: str, cents: int, qty: int = 1)` validating `qty >= 0`, `cents >= 0`, and non-empty `sku` in `__post_init__`.
- Use a local `seen: set[str] = set()` inside the function (`O(1)` membership lookup, zero shared state!).
- Flatten nesting with `if line.qty == 0 or line.sku in seen: continue` guard clauses.

## Solution

```python
from collections.abc import Sequence
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class OrderLine:
    sku: str
    cents: int
    qty: int = 1

    def __post_init__(self) -> None:
        if not self.sku.strip():
            raise ValueError("sku cannot be empty")
        if self.cents < 0 or self.qty < 0:
            raise ValueError("cents and qty must be >= 0")

def dedupe_order_total(lines: Sequence[OrderLine]) -> int:
    seen: set[str] = set()
    total_cents = 0
    for line in lines:
        if line.qty == 0 or line.sku in seen:
            continue
        seen.add(line.sku)
        total_cents += line.cents * line.qty
    return total_cents

sample = [OrderLine("A1", 500, 2), OrderLine("A1", 500, 1), OrderLine("B2", 250, 0), OrderLine("C3", 100)]
assert dedupe_order_total([]) == 0
assert dedupe_order_total(sample) == 1100
print("Clean total cents:", dedupe_order_total(sample))
```

## Walkthrough

Notice how six bugs disappeared in fewer lines than the original:

1. **No shared mutable default (`seen=[]` removed):** `seen: set[str] = set()` initializes freshly on every call.
2. **`O(n^2)` -> `O(n)`:** `set` lookup checks duplicate SKUs in `O(1)`.
3. **Fail fast instead of bare `except: pass`:** Invalid SKUs or negative cents raise explicit `ValueError` inside `OrderLine.__post_init__`.
4. **Covariant parameter type (`Sequence[OrderLine]`):** Accepts `list[OrderLine]` or `tuple[OrderLine, ...]` safely under strict `mypy`/`pyright`.
