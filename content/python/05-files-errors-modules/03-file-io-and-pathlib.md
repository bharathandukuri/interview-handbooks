---
type: concept
title: "File I/O, `pathlib.Path`, JSON, and CSV"
difficulty: easy
tags: [files, pathlib, json]
---

Always open files with `with` (so they auto-close even on errors) and specify `encoding="utf-8"` for text files.

```python
from pathlib import Path
import json

cfg_path = Path("config") / "settings.json"   # cross-platform `/` operator
cfg_path.parent.mkdir(parents=True, exist_ok=True)
cfg_path.write_text(json.dumps({"port": 8080}, indent=2), encoding="utf-8")

data = json.loads(cfg_path.read_text(encoding="utf-8"))
```

**Streaming large files:** Never call `.read()` or `.readlines()` on multi-gigabyte logs — iterate over the file handle line by line in O(1) memory:

```python
with open("server.log", mode="r", encoding="utf-8") as f:
    for line in f:            # reads lazily one line at a time
        process(line)
```

**Common modes:** `"r"` (read text), `"w"` (truncate/write), `"a"` (append), `"x"` (exclusive create — fails if exists), `"rb"`/`"wb"` (raw binary `bytes`). For tabular files, use `csv.DictReader` / `csv.DictWriter` with `newline=""`.
