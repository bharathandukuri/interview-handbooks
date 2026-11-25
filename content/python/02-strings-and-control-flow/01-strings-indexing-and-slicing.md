---
type: concept
title: "Strings, indexing, slicing, and raw strings"
difficulty: easy
tags: [strings, slicing, basics]
revision:
  - "Strings are immutable Unicode sequences; `s[start:stop:step]` slices safely without IndexError"
  - 'Use `s[::-1]` to reverse and `r"..."` raw strings for regexes/paths'
---

Strings (`str`) are **immutable sequences of Unicode characters**. Because they are immutable, operations return new strings rather than modifying in place.

```python
s = "Python"
print(s[0], s[-1])     # P n  (negative indices count from the end)
print(s[1:4])          # yth  (start inclusive, stop exclusive)
print(s[::-1])         # nohtyP  (step -1 reverses any sequence)
```

**Slicing rule:** `s[start:stop:step]`. Out-of-range slices never raise `IndexError` (`s[100:] == ""`), whereas single indexing (`s[100]`) raises `IndexError`.

**Raw & multiline strings:**

- Use `r"C:\new\path"` for regexes and Windows paths so `\n` isn't treated as a newline.
- Use triple quotes `"""..."""` for multiline text and docstrings.

:::tip[Slice copying]
`s[:]` (or `lst[:]` on a list) creates a shallow copy of the whole sequence.
:::
