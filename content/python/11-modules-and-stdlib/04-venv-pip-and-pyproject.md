---
type: concept
title: "Virtual environments, pip, uv, and pyproject.toml"
difficulty: easy
tags: [venv, pip, uv, packaging, tooling]
related: [python.modules-and-stdlib.importing-modules-and-packages]
---

Installing packages into your computer's global Python breaks projects quickly: Project A might require `httpx==0.24` while Project B needs `httpx==0.28`. A **virtual environment (`venv`)** gives each project its own isolated Python copy and `site-packages/` folder inside the project directory.

**1. Built-in `venv` + `pip` commands (run in your terminal):**

```bash
# Create an isolated `.venv` folder inside your project:
python -m venv .venv

# Activate it:
.venv\Scripts\activate              # Windows (PowerShell / cmd)
source .venv/bin/activate           # macOS / Linux

# Always invoke pip through `python -m pip` so it matches the active Python!
python -m pip install requests pytest
python -m pip freeze > requirements.txt

# Recreate exact environment later (never commit `.venv/` to Git — add it to .gitignore!):
python -m pip install -r requirements.txt
```

**2. Modern Python packaging (`pyproject.toml` and `uv`):**
Instead of ad-hoc `requirements.txt` files, modern Python defines project name, minimum Python version, and dependencies inside **`pyproject.toml`** (PEP 621):

```toml
[project]
name = "my-app"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "httpx>=0.27",
]
```

And in modern workflows, **`uv`** (an ultra-fast tool replacing `venv` + `pip` + `pip-tools`) creates `.venv`, resolves locked versions into `uv.lock`, and syncs environments in milliseconds:

```bash
uv init my-app
uv add httpx pytest
uv run python main.py
```

**Common edge cases to avoid:**

- **Never commit `.venv/` to Git** — commit `pyproject.toml` + lockfile (`uv.lock` or `requirements.txt`) so teammates rebuild cleanly for their OS.
- **Why `python -m pip install` instead of `pip install`?** On machines with multiple Python versions, bare `pip` can accidentally install packages into an old system Python while `python` points elsewhere. `python -m pip` guarantees both point to the exact same environment.
