---
type: compare
title: "`pathlib.Path` vs `os.path`"
difficulty: easy
left: "pathlib.Path"
right: "os.path"
tags: [pathlib, files, stdlib]
---

| Feature                 | `pathlib.Path`                     | `os.path`                               |
| ----------------------- | ---------------------------------- | --------------------------------------- |
| Representation          | Object-oriented (`Path` instances) | Plain `str`                             |
| Joining paths           | `base / "sub" / "file.txt"`        | `os.path.join(base, "sub", "file.txt")` |
| Name / stem / ext       | `p.name`, `p.stem`, `p.suffix`     | `os.path.splitext(os.path.basename(p))` |
| Read / write quick text | `p.read_text()`, `p.write_text()`  | Requires separate `open()` boilerplate  |
| Globbing                | `p.glob("**/*.py")`                | Requires `glob.glob()` module           |
| Python standard         | Recommended since Python 3.4+      | Legacy procedural API                   |

## Verdict

Use **`pathlib.Path`** everywhere in modern Python — it's cross-platform, readable, and bundles filesystem operations (`mkdir`, `unlink`, `glob`, `read_text`) onto a single object. Only drop to `os.fspath()` if an older third-party C library demands a raw `str`.
