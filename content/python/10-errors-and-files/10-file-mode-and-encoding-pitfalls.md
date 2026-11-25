---
type: pitfall
title: "File cursor exhaustion (double read()), 'w' truncation, and missing UTF-8"
difficulty: easy
tags: [files, encoding, gotchas, io]
related: [python.errors-and-files.reading-and-writing-files-with]
---

## The trap

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / "data.txt"
    p.write_text("hello", encoding="utf-8")

    with open(p, "r", encoding="utf-8") as f:
        first_read = f.read()
        second_read = f.read()          # Trap 1: file cursor is already at the END!
        print("second:", repr(second_read))  # '' (empty string!)

    # Trap 2: opening with "w" erases everything before you write:
    with open(p, "w", encoding="utf-8") as f:
        pass
    print("after empty 'w':", repr(p.read_text(encoding="utf-8")))  # ''!
```

## The fix

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / "data.txt"
    p.write_text("café 🚀", encoding="utf-8")

    with open(p, "r", encoding="utf-8") as f:
        text = f.read()
        f.seek(0)                       # rewind cursor back to byte 0 if re-reading
        lines = f.readlines()

    with open(p, "a", encoding="utf-8") as f:  # use "a" when adding, not "w"!
        f.write("\nappended line")

    print(text, "| lines:", len(lines))
    print(p.read_text(encoding="utf-8"))
```

## Why it happens

1. **The file cursor (offset):** An open file keeps an internal byte cursor that moves forward as you `.read()`, `.readline()`, or loop `for line in f:`. Once it reaches the end of the file (**EOF**), every subsequent `.read()` returns `""` (empty string) unless you rewind with `f.seek(0)` or store the data in a variable.
2. **Truncate on open (`"w"`):** Opening an existing file in `"w"` mode immediately shrinks it to `0` bytes — even if an exception crashes your code before `.write()` runs! Prefer `"a"` for logs/appending, `"x"` when refusing to overwrite, or write to a temporary file and `Path.replace()` for atomic updates.
3. **Platform encoding trap:** Without `encoding="utf-8"`, Windows can pick `cp1252` or another legacy codepage and raise `UnicodeEncodeError` / `UnicodeDecodeError` on `"café"` or emojis (`"🚀"`). Always pass `encoding="utf-8"`.
