---
type: concept
title: "Change how print() works: sep and end"
difficulty: easy
tags: [print, basics]
revision:
  - "`sep` is what goes between items (default: one space)"
  - "`end` is what goes after everything (default: a new line)"
---

`print()` has two helpers you can change:

- `sep` is what goes **between** the items. The normal value is one space.
- `end` is what goes **after** everything. The normal value is a new line.

```python
print("25", "11", "2026", sep="-")
print("Loading", end="...")
print("done")
```

The screen shows:

```text
25-11-2026
Loading...done
```

The first line uses `sep="-"`, so dashes sit between the items.

The second `print()` uses `end="..."`, so it does **not** start a new line. The next `print()` carries on right after it.

:::tip[Remove the space]
Use `sep=""` when you do not want anything between the items. You will use this a lot.
:::
