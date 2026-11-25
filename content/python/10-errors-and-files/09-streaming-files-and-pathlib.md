---
type: concept
title: "Streaming large files line by line and using pathlib.Path"
difficulty: easy
tags: [files, pathlib, streaming, memory]
related: [python.errors-and-files.reading-and-writing-files-with]
---

Calling `f.read()` or `f.readlines()` loads the **entire file into RAM** at once. For a tiny config file that is fine, **but** on a 10 GB server log it crashes your program with `MemoryError`!

In Python, an open file object is **iterable** — looping `for line in f:` reads only **one line at a time** into memory (`O(1)` file buffer space, regardless of file size).

Meanwhile, modern Python represents filesystem paths with **`pathlib.Path`** instead of manual string joining (`folder + "/" + file`), so code works seamlessly across Windows (`\`) and Linux/macOS (`/`):

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    log_path = Path(tmp) / "logs" / "app.log"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log_path.write_text("INFO started\nERROR disk full\nINFO done\n", encoding="utf-8")

    # Path inspection helpers
    print("name:", log_path.name, "| stem:", log_path.stem, "| suffix:", log_path.suffix)
    print("exists?", log_path.exists(), "| is_file?", log_path.is_file())

    # Stream line by line in O(1) memory instead of f.read():
    errors = []
    with log_path.open("r", encoding="utf-8") as f:
        for line_no, raw_line in enumerate(f, start=1):
            line = raw_line.rstrip("\r\n")       # strip ONLY the line ending, keep indent!
            if line.startswith("ERROR"):
                errors.append((line_no, line))
    print("errors:", errors)
```

The screen shows:

```text
name: app.log | stem: app | suffix: .log
exists? True | is_file? True
errors: [(2, 'ERROR disk full')]
```

**Why `line.rstrip("\r\n")` instead of `line.strip()`?**
`line.strip()` deletes leading spaces and tabs too! `rstrip("\r\n")` removes only the trailing newline while preserving leading indentation in formatted text, logs, or CSV fields.

**Handy `Path` methods you will use daily:**

- `folder / "sub" / "file.txt"` builds paths cleanly using `/` (overloaded for `Path`).
- `path.read_text(encoding="utf-8")` and `path.write_text(text, encoding="utf-8")` open, read/write, and close small files in one clean call.
- `folder.glob("*.py")` / `folder.rglob("*.py")` finds matching files (non-recursive vs recursive across subdirectories).
- Edge case on file paths: avoid checking `if path.exists():` before reading if `try ... except FileNotFoundError:` works directly (EAFP avoids TOCTOU race conditions).
