---
type: question
title: "pytest fixtures, parametrize, and mocking"
difficulty: medium
tags: [testing, pytest, mocking]
---

## Answer

**Fixtures** provide setup/teardown for tests without subclassing anything:

```python
import pytest

@pytest.fixture
def db(tmp_path):           # pytest injects tmp_path automatically
    path = tmp_path / "test.db"
    conn = connect(path)
    yield conn              # everything after yield is teardown
    conn.close()

def test_insert(db):        # pytest injects the fixture by name
    db.insert({"id": 1})
    assert db.count() == 1
```

`scope=` controls sharing: `"function"` (default), `"class"`, `"module"`, `"session"`.

**Parametrize** runs one test against many inputs without copy-paste:

```python
@pytest.mark.parametrize("n,expected", [(0, 1), (1, 1), (5, 120)])
def test_factorial(n, expected):
    assert factorial(n) == expected
```

**Mocking — patch where it's _used_, not where it's _defined_:**

```python
# module under test: myapp.service uses `requests.get`
from unittest.mock import patch

def test_fetch(monkeypatch):
    monkeypatch.setattr("myapp.service.requests.get", lambda *a, **k: FakeResp())
    # OR the equivalent with patch:

with patch("myapp.service.requests.get") as mock_get:
    mock_get.return_value.json.return_value = {"ok": True}
    result = service.fetch("http://example.com")
    assert result["ok"] is True
```

## Why interviewers ask

pytest mastery is table stakes for backend roles. Interviewers want to see that you know fixtures (not setUp/tearDown), parametrize (not for loops in tests), and that you patch names in the right namespace.

## Follow-ups

- When would you use `pytest-mock` over `unittest.mock`?
- How do you share fixtures across test files?
