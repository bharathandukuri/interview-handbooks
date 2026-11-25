---
type: question
title: "Mocking in `pytest`: `monkeypatch` vs `unittest.mock.patch`"
difficulty: medium
mostAsked: true
tags: [testing, pytest, mocking]
revision:
  - "Always patch where the name is **looked up / used**, not where it was originally defined"
  - "Pass `autospec=True` to `patch()` so typos or wrong argument counts still fail tests"
  - "`monkeypatch` auto-reverts env vars (`setenv`), attributes (`setattr`), and dict items after each test"
---

## Answer

Both `monkeypatch` (pytest fixture) and `unittest.mock.patch` temporarily replace objects during a test and restore them automatically afterward.

```python
# myapp/service.py does: `from myapp.client import fetch_user`
from unittest.mock import patch

def test_service_uses_client():
    # Patch `myapp.service.fetch_user` (where looked up), NOT `myapp.client.fetch_user`!
    with patch("myapp.service.fetch_user", autospec=True) as mock_fetch:
        mock_fetch.return_value = {"id": 1}
        assert service.get_name(1) == "unknown"
        mock_fetch.assert_called_once_with(1)
```

Use **`monkeypatch`** for simple attribute/env/dict overrides (`monkeypatch.setenv("API_KEY", "test")`), and **`patch(..., autospec=True)`** when you need call-count assertions (`.assert_called_once_with(...)`) or side-effect sequences.

## Why interviewers ask

Patching the wrong namespace (`client.fetch_user` instead of `service.fetch_user`) is the #1 mocking bug in Python test suites.

## Follow-ups

- What does `autospec=True` catch that a plain `MagicMock()` misses?
- When should you use an in-memory fake / `Protocol` instead of mocking?
