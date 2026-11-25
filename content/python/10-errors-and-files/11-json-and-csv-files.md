---
type: concept
title: "Working with JSON and CSV files"
difficulty: medium
mostAsked: true
tags: [files, json, csv, stdlib]
related:
  [
    python.errors-and-files.reading-and-writing-files-with,
    python.errors-and-files.json-roundtrip-predict,
  ]
revision:
  - "`json.dumps`/`json.loads` convert Python <-> JSON strings; `json.dump`/`json.load` read/write file objects directly"
  - "JSON only supports objects (`str` keys), arrays (`list`), strings, numbers, booleans, and `null` — `tuple` becomes `list` and `set` fails"
  - "Always open CSV files with `newline=''` and prefer `csv.DictReader` / `csv.DictWriter` for named columns"
---

Python's built-in `json` and `csv` modules handle the two most common structured data formats without needing extra libraries.

**1. JSON (`import json`):**
Remember the `s` suffix stands for **string**: `dumps` / `loads` work with Python `str`, whereas `dump` / `load` work directly with an open file handle:

```python
import csv, json, tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    # --- JSON write & read ---
    json_path = Path(tmp) / "user.json"
    user = {"name": "Ada", "skills": ["python", "sql"], "active": True, "note": None}

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(user, f, indent=2)            # pretty-printed to file

    with open(json_path, "r", encoding="utf-8") as f:
        loaded = json.load(f)
    print("JSON user:", loaded["name"], loaded["skills"])

    # --- CSV write & read (ALWAYS pass newline="") ---
    csv_path = Path(tmp) / "scores.csv"
    rows = [{"name": "Ada", "score": 95}, {"name": "Bob", "score": 88}]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "score"])
        writer.writeheader()
        writer.writerows(rows)

    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):           # note: CSV values come back as strings!
            print("CSV row:", row["name"], int(row["score"]))
```

The screen shows:

```text
JSON user: Ada ['python', 'sql']
CSV row: Ada 95
CSV row: Bob 88
```

**Watch these real-world edge cases:**

- **JSON type conversions:** JSON has no `tuple` (turns into `list`), no `set` (`TypeError: Object of type set is not JSON serializable`), no `int` dict keys (`{1: "a"}` becomes `{"1": "a"}`), and rejects trailing commas or single quotes (`{'a': 1}` is invalid JSON -> `json.JSONDecodeError`, a subclass of `ValueError`!).
- **CSV `newline=""`:** Omitting `newline=""` causes Windows to translate `\r\n` twice, creating blank empty lines between every row when writing CSVs. Also remember `csv.DictReader` yields every value as a **`str`**, so convert numbers explicitly (`int(row["score"])`).
- **Large JSON / logs:** `json.load()` parses the whole JSON document into memory; for gigabyte logs, engineers use **JSON Lines (`.jsonl`)** — one JSON object per line, streamed with `for line in f: json.loads(line)`!
