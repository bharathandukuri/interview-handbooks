---
type: problem
title: "Streaming Log Error Aggregator"
difficulty: medium
complexity:
  time: "O(n)"
  space: "O(k) unique codes"
approach: "Lazy file iteration + Counter"
tags: [files, collections, streaming]
---

## Problem

Given a path to a potentially multi-gigabyte log file where lines look like `2026-01-10 ERROR E402 Timeout`, return the top `k` most frequent error codes (`E402`, etc.) without loading the whole file into memory.

```
Input:  lines with "ERROR <CODE> <msg>" and "INFO ..."
Output: [("E402", 42), ("E500", 17)]
```

## Hint

- Iterate over the `Path.open()` file handle line-by-line rather than `.read_text()`.
- `collections.Counter.most_common(k)` handles top-k cleanly.

## Solution

```python
from collections import Counter
from pathlib import Path

def top_error_codes(log_path: Path, k: int = 3) -> list[tuple[str, int]]:
    counts: Counter[str] = Counter()
    with log_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            parts = line.split(maxsplit=3)
            if len(parts) >= 3 and parts[1] == "ERROR":
                counts[parts[2]] += 1
    return counts.most_common(k)
```

## Walkthrough

`log_path.open()` streams one buffered line at a time, keeping memory proportional only to the `k` distinct error codes (`O(u)`), not the file size. `line.split(maxsplit=3)` avoids splitting the trailing message text unnecessarily.
