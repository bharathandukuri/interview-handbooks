---
type: concept
title: "`pytest` fundamentals: fixtures, `parametrize`, and `raises`"
difficulty: medium
mostAsked: true
tags: [testing, pytest, stdlib]
revision:
  - "`@pytest.fixture` with `yield` runs setup before `yield` and guaranteed teardown after"
  - "`@pytest.mark.parametrize` tests multiple input/output cases without loops"
  - "Use built-in `tmp_path` for temp files and `pytest.raises(ExcType)` for expected errors"
---

`pytest` uses plain `assert` statements (rewritten automatically for rich failure diffs) and dependency-injected **fixtures**:

```python
import pytest

@pytest.fixture(scope="function")        # scopes: function, class, module, session
def sample_file(tmp_path):               # built-in temp directory fixture
    path = tmp_path / "data.txt"
    path.write_text("hello", encoding="utf-8")
    yield path                           # teardown runs after test finishes

@pytest.mark.parametrize("raw,expected", [("10", 10), ("-3", -3)])
def test_parse_valid(raw: str, expected: int) -> None:
    assert int(raw) == expected

def test_parse_invalid() -> None:
    with pytest.raises(ValueError, match="invalid literal"):
        int("abc")
```

Share fixtures across test files by placing them in `conftest.py` — no explicit imports required.
