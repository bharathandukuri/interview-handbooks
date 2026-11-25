---
type: concept
title: "Slicing: cut substrings with [start:stop:step]"
difficulty: easy
mostAsked: true
tags: [strings, slicing, edge-cases]
related: [python.strings.indexing-pick-one-letter]
revision:
  - "**Slicing** (`s[start:stop]`) uses a **half-open range**: `start` is included, `stop` is **excluded**"
  - "**Stride (`step`)** skips characters or flips direction (`s[::-1]` reverses any string)"
  - "Out-of-range slice bounds never raise `IndexError`; only a step of `0` raises `ValueError`"
---

**Slicing** extracts a piece (called a **substring**) using `s[start:stop]` or `s[start:stop:step]`. It uses a **half-open range**: Python includes the character at `start` and stops **just before** `stop`.

```python
word = "Python"
print(word[0:2])     # indices 0, 1 -> "Py"
print(word[:3])      # start defaults to 0 -> "Pyt"
print(word[3:])      # stop defaults to end -> "hon"
print(word[::2])     # step (stride) 2 -> indices 0, 2, 4 -> "Pto"
print(word[::-1])    # negative step -> walk backwards -> "nohtyP"
print(word[2:99])    # out-of-range stop clamps safely -> "thon"
```

The screen shows:

```text
Py
Pyt
hon
Pto
nohtyP
thon
```

**Why does `word[0:3]` exclude index `3`?**
Stopping right before `stop` gives two clean properties:

1. Length is simply `stop - start` (`3 - 0 == 3` characters).
2. `word[:3] + word[3:]` splits cleanly into `"Pyt"` + `"hon"` with zero overlap and zero gaps!

**Slice edge cases:**

- **Out-of-bounds indices:** Unlike single indexing (`word[99]` -> `IndexError`), slices clamp silently: `"abc"[10:]` gives `""` and `""[0:5]` gives `""`.
- **Reversed start/stop:** `"Python"[4:1]` returns `""` (empty string) because positive step `+1` cannot reach `1` from `4`. Use negative step `"Python"[4:1:-1]` -> `"oht"`.
- **Zero step:** `word[::0]` raises `ValueError: slice step cannot be zero`.
