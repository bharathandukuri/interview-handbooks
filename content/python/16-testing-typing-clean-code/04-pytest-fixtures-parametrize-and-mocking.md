---
type: concept
title: "pytest fixtures, parametrize, tmp_path, monkeypatch, and autospec mocking"
difficulty: medium
mostAsked: true
tags: [testing, pytest, mocking, fixtures]
related: [python.testing-typing-clean-code.unittest-and-pytest-basics]
revision:
  - "`@pytest.mark.parametrize` runs one test function across dozens of `(input, expected)` edge cases cleanly"
  - "**Fixtures** (`@pytest.fixture`) inject reusable setup (plus `yield` teardown); `tmp_path` isolates temp files automatically"
  - "When mocking with `unittest.mock.patch`, pass **`autospec=True`** so mocked calls still reject typo method names or wrong arguments!"
---

Real applications talk to clocks, databases, files, and HTTP APIs — and unit tests must run **fast**, **offline**, and **independently** without touching real user files or production servers!

Here are the four tools professional Python teams use every day (`unittest.mock` ships built-in; `pytest` runs with `pytest`):

**1. `unittest.mock.patch(..., autospec=True)` (built-in example):**

```python
from unittest.mock import patch

class WeatherClient:
    def fetch_temp(self, city: str) -> float:
        raise RuntimeError("real network disabled in unit tests")

def format_forecast(client: WeatherClient, city: str) -> str:
    temp = client.fetch_temp(city)
    return f"{city}: {temp:.1f}C"

with patch.object(WeatherClient, "fetch_temp", autospec=True, return_value=22.4) as mocked:
    client = WeatherClient()
    print(format_forecast(client, "Delhi"))
    print("called once with:", mocked.call_args.args[1])
```

The screen shows:

```text
Delhi: 22.4C
called once with: Delhi
```

**2. Key `pytest` patterns you will see in every repository:**

- **`@pytest.mark.parametrize("raw,expected", [(" 5 ", 5), ("-2", -2), ("bad", None)])`:** Turns 10 near-identical test functions into one clean data table where each row reports separately on failure!
- **`@pytest.fixture` + `yield` teardown:** Request fixtures by parameter name (`def test_db(fresh_db):`); code before `yield` sets up state, and code after `yield` cleans up even if the test fails (`scope="function"` default, or `"module"`/`"session"` for expensive DB setups!).
- **Built-in `tmp_path` & `monkeypatch`:** Never write tests against fixed filenames like `"test.txt"`! Accept `tmp_path` (fresh temporary `pathlib.Path` per test) and use `monkeypatch.setenv("API_KEY", "dummy")` to isolate environment variables cleanly.
- **Why `autospec=True` matters:** Without `autospec=True`, a `MagicMock` accepts `mock.fetch_tmep()` (typo!) and `mock.fetch_temp(1, 2, 3, 4)` silently — hiding broken refactors while tests stay falsely green! Also patch **where the name is looked up** (`patch("myapp.service.fetch")`), not where it was originally defined!
