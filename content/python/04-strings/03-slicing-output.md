---
type: predict
title: "Tracing string slices and negative bounds"
difficulty: easy
tags: [strings, slicing, predict]
related: [python.strings.slicing-cut-a-piece]
revision:
  - "`word[1:4]` includes `1, 2, 3` and stops before `4`"
  - '`word[4:1]` with positive step returns `""`; `[::-1]` reverses the string'
options:
  - "yth, on, nohtyp, tho"
  - "yth, on, nohtyp, ''"
  - "ytho, hon, nohtyp, oht"
  - "It raises IndexError"
answer: 1
---

Trace every slice carefully — look closely at line 4 (`word[4:1]`)!

```python
word = "python"
print(word[1:4])
print(word[-2:])
print(word[::-1])
print(repr(word[4:1]))
```

(Here `repr()` simply prints quotes around empty text `''` so you can see it clearly on screen.)

## Output

```text
yth
on
nohtyp
''
```

## Explanation

Use the index map for `"python"`: `p(0/-6)`, `y(1/-5)`, `t(2/-4)`, `h(3/-3)`, `o(4/-2)`, `n(5/-1)`.

- **`word[1:4]`:** Starts at `1` (`'y'`) and stops before `4` (`'o'`) -> **`yth`**.
- **`word[-2:]`:** Starts at `-2` (`'o'`) and continues to the end -> **`on`**.
- **`word[::-1]`:** Negative step `-1` walks from the end to the start -> **`nohtyp`**.
- **`word[4:1]`:** Start `4` is already past stop `1` with default positive step `+1`, so the slice is empty (**`''`**) without raising an error.
