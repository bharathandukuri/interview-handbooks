---
type: predict
title: "Tricky string counts, replace and find"
difficulty: medium
mostAsked: true
tags: [strings, methods, edge-cases, predict]
related:
  [python.strings.find-count-and-replace, python.strings.case-and-strip-methods]
revision:
  - "`.count()` only counts **non-overlapping** substrings"
  - "`.replace(old, new, 1)` replaces only the first occurrence; `.find()` returns `0` (falsy!) at index 0"
options:
  - "baXna, 3, True"
  - "baXX, 2, 0"
  - "baXna, 2, 0"
  - "baXna, 2, -1"
answer: 2
---

Trace method chaining, optional `replace` count, and non-overlapping `.count()` carefully.

```python
s = "  banana  "
print(s.strip().replace("na", "X", 1))
print("aaaa".count("aa"))
print(s.strip().find("ba"))
```

## Output

```text
baXna
2
0
```

## Explanation

1. **Line 1 (`s.strip().replace("na", "X", 1)`):**
   - `s.strip()` removes spaces from both ends, returning `"banana"`.
   - `.replace("na", "X", 1)` replaces **at most `1`** occurrence (the first `"na"` at index `2`), leaving the second `"na"` untouched -> **`baXna`**.
2. **Line 2 (`"aaaa".count("aa")`):** `.count()` steps past each found match and never counts overlapping substrings. Match 1 uses indices `0..1`, Match 2 uses `2..3`, giving **`2`** (not `3`).
3. **Line 3 (`s.strip().find("ba")`):** `"ba"` starts right at the beginning of `"banana"` — index **`0`**. (Remember: `0` is falsy, so never test `if text.find(...):`!)
