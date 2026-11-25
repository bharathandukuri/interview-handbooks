---
type: concept
title: "Searching, counting, and replacing substrings"
difficulty: easy
tags: [strings, methods, search, edge-cases]
related: [python.strings.case-and-strip-methods]
revision:
  - 'A **substring** is any contiguous slice inside a string (`""` is considered inside every string)'
  - "`in` checks membership (`True`/`False`); `.find()` returns the index or `-1`; `.index()` raises `ValueError`"
  - '`.count()` counts **non-overlapping** matches (`"aaaa".count("aa") == 2`)'
---

Python provides clean built-in tools to check for a **substring** (a smaller consecutive piece inside a string), count it, or replace it.

```python
line = "bananas"
print("na" in line)               # membership check -> True
print(line.find("na"))            # first match index -> 2
print(line.find("xy"))            # missing -> -1 (no crash)
print(line.count("a"))            # count matches -> 3
print("aaaa".count("aa"))         # non-overlapping! -> 2 (not 3)
print(line.replace("na", "NA"))   # replace all matches -> "baNANAs"
print(line.replace("na", "NA", 1))# replace only 1st match -> "baNAnas"
```

The screen shows:

```text
True
2
-1
3
2
baNANAs
baNAnas
```

**Key methods and edge cases:**

- **`.find(sub)` vs `.index(sub)`:** Both return the starting index of the first match (`2`), or `-1` (`find`) vs `ValueError` (`index`) if missing. Use `.rfind(sub)` to search from the right.
- **Non-overlapping `.count()`:** `"aaaa".count("aa")` finds `[0:2]` and `[2:4]`, returning `2` (never overlapping `[1:3]`). Also `"".count("")` and `"abc".count("")` count the boundaries around characters (`len(s) + 1`)!
- **`.startswith()` / `.endswith()`:** Check prefixes or suffixes cleanly (e.g. `filename.endswith(".py")`), without risking out-of-range slices.
- **`.replace()` when missing:** Replacing text that is not found safely returns the original string unchanged.
