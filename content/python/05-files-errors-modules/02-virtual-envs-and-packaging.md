---
type: concept
title: "Virtual environments and `pyproject.toml`"
difficulty: easy
tags: [venv, packaging, tooling]
---

Never install project dependencies into your global system Python — different projects need conflicting library versions. A **virtual environment** isolates Python binaries and packages per project.

```bash
# Built-in standard venv workflow
python -m venv .venv
source .venv/bin/activate     # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Modern fast workflow with `uv`
uv venv && uv pip install pytest ruff
```

**Modern project configuration (`pyproject.toml`, PEP 517/621):** Replaces legacy `setup.py` with a single declarative file for dependencies, build system, and tool settings (`ruff`, `pytest`, `mypy`):

```toml
[project]
name = "my-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = ["httpx>=0.27", "pydantic>=2.0"]
```

Pin exact versions in a lockfile (`requirements.lock` / `uv.lock`) for reproducible production builds, and always add `.venv/` to `.gitignore`.
