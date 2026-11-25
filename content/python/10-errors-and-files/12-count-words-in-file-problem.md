---
type: problem
title: "Chapter challenge: Count words in a file safely"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n) total characters read + O(u log u) for sorting u unique words"
  space: "O(u) for storing u unique words (streams lines in O(1) file buffer memory)"
approach: "Open safely with UTF-8, stream line by line, strip edge punctuation case-insensitively, aggregate counts, handle missing/empty files"
tags: [files, errors, dictionaries, interview]
related:
  [
    python.errors-and-files.streaming-files-and-pathlib,
    python.dictionaries-and-sets.word-counter,
  ]
revision:
  - "Combine **streaming `for line in f:`** (`O(1)` file buffer) with **`try/except FileNotFoundError`** and explicit **`encoding='utf-8'`**"
  - "Normalize word casing (`.lower()`) and edge punctuation (`.strip(...)`), skipping empty tokens like `'--'`"
---

## Problem

Write a function `top_words(path, n=3)` that reads any text file at `path` and returns the `n` most frequent `(word, count)` pairs sorted by:

1. Highest count first (`-count`)
2. Alphabetically (`word`) on ties

Handle real-world edge cases cleanly:

- Missing file -> raise a clear `FileNotFoundError` (or return `[]` if an optional flag/missing check is requested — here, let us support `missing_ok=False` so callers choose!).
- Empty file or file with only whitespace/punctuation -> return `[]`.
- Mixed case (`"Python"`, `"python"`) and edge punctuation (`"world!"`, `"(python),"`, `"--"`).
- Large files -> do **not** call `.read()`; stream `for line in f:`.

## Hint

- Open the file with `with open(path, "r", encoding="utf-8") as f:` inside `try ... except FileNotFoundError:`.
- For each line, split on whitespace (`line.split()`), normalize with `.lower().strip(".,!?;:\"'()[]{}-")`, and check `if word:` before incrementing `counts[word] = counts.get(word, 0) + 1`.
- Guard `n <= 0` cleanly (return `[]`), then sort `counts.items()` with `key=lambda pair: (-pair[1], pair[0])` and slice `[:n]`.

## Solution

```python
import tempfile
from pathlib import Path

PUNCTUATION = ".,!?;:\"'()[]{}-_"

def top_words(path, n=3, missing_ok=False):
    if n <= 0:
        return []
    counts = {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                for raw in line.split():
                    word = raw.lower().strip(PUNCTUATION)
                    if word:
                        counts[word] = counts.get(word, 0) + 1
    except FileNotFoundError:
        if missing_ok:
            return []
        raise
    ranked = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))
    return ranked[:n]

with tempfile.TemporaryDirectory() as tmp:
    sample = Path(tmp) / "article.txt"
    sample.write_text(
        "Python makes files easy! Easy, clean, and Python-friendly -- yes, Python.\n",
        encoding="utf-8",
    )
    print("Top 3:", top_words(sample, n=3))
    print("Missing (safe):", top_words(Path(tmp) / "ghost.txt", missing_ok=True))
```

## Walkthrough

Notice how cleanly every concept from Chapters 04, 07, 08, 09, and 10 clicks together:

- **Streaming I/O:** `for line in f:` keeps memory proportional to the number of _unique_ words rather than file size.
- **Explicit `raise` inside `except FileNotFoundError:`:** when `missing_ok=False`, bare `raise` passes the original `FileNotFoundError` and traceback untouched to the caller instead of silently returning `[]` and hiding a typo in a filename.
- **Tie-breaking sort:** `key=lambda pair: (-pair[1], pair[0])` sorts descending by count (negated number) and ascending alphabetically (`pair[0]`) on ties. Note `.strip(PUNCTUATION)` leaves internal hyphens intact (`"python-friendly"` stays one token while trailing `"--"` becomes empty `""` and gets skipped!).
