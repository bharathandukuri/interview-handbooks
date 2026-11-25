---
type: concept
title: "Reading and writing files safely with with open(..., encoding='utf-8')"
difficulty: easy
mostAsked: true
tags: [files, context-managers, io, encoding]
related:
  [
    python.errors-and-files.try-except-else-finally,
    python.errors-and-files.streaming-files-and-pathlib,
  ]
revision:
  - "Always open files with `with open(path, mode, encoding='utf-8') as f:` so Python closes the file automatically — even on errors"
  - "`'w'` **truncates (erases)** an existing file immediately; use `'a'` to append or `'x'` to fail if it already exists"
  - "Always pass `encoding='utf-8'` for text files instead of relying on platform defaults (`cp1252` on Windows vs `utf-8` on Linux/macOS)"
---

When a program opens a file, the operating system grants it a **file handle** (a limited OS resource) and keeps unwritten bytes in a **memory buffer** until `.flush()` or `.close()` runs. If your function crashes before `.close()` — or you simply forget to call it — changes may stay unsaved or your server can run out of file handles!

Using a **`with` statement** (a **context manager**, explained under the hood in Chapter 13) guarantees Python closes the file automatically the moment the `with` block exits — whether normally or through an exception.

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    note_file = Path(tmp) / "notes.txt"

    # 1. Write ("w" creates or overwrites; always pass encoding="utf-8")
    with open(note_file, "w", encoding="utf-8") as f:
        f.write("Line 1: Python\n")
        f.write("Line 2: Files\n")

    # 2. Append ("a" adds at the end without erasing existing contents)
    with open(note_file, "a", encoding="utf-8") as f:
        f.write("Line 3: Context managers\n")

    # 3. Read back ("r" is the default text mode)
    with open(note_file, "r", encoding="utf-8") as f:
        content = f.read()

    print(content.strip())
    print("Closed automatically?", f.closed)
```

The screen shows:

```text
Line 1: Python
Line 2: Files
Line 3: Context managers
Closed automatically? True
```

**Essential file modes (text vs binary):**

| Mode   | Meaning                                 | Missing file?       | Existing file?               |
| ------ | --------------------------------------- | ------------------- | ---------------------------- |
| `"r"`  | Read text (default)                     | `FileNotFoundError` | Reads from start             |
| `"w"`  | Write text                              | Creates new file    | **Erases all old contents!** |
| `"a"`  | Append text                             | Creates new file    | Writes at end                |
| `"x"`  | Exclusive create                        | Creates new file    | **`FileExistsError`**        |
| `"rb"` | Read raw **bytes** (images, PDFs, ZIPs) | `FileNotFoundError` | No `encoding=` allowed       |
| `"wb"` | Write raw **bytes**                     | Creates new file    | Erases old bytes             |

**Two critical rules:**

- **Always pass `encoding="utf-8"` for text files:** On Windows, Python may default to `"cp1252"`, crashing with `UnicodeEncodeError` or producing corrupted characters when text contains emojis or non-ASCII letters (`"café"`, `"₹"`). Never pass `encoding=` with binary modes (`"rb"` / `"wb"`), because binary mode handles raw bytes (`b"..."`), not encoded characters.
- **`f.write()` returns the character count and does NOT add `\n` automatically** (unlike `print()`). Add `\n` explicitly or pass a list of strings ending in `\n` to `f.writelines(lines)`.
