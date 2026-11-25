---
type: predict
title: "What does this print? (sep, end, and empty print())"
difficulty: easy
tags: [print, sep, end, trace]
related: [python.getting-started.sep-and-end]
options:
  - "A-B-C\nGo!Done"
  - "A B C\nGo\nDone"
  - "A-B-C\nGo!\nDone"
  - "A-B-C-Go!Done"
answer: 0
---

Trace each line carefully (watching both `sep` and `end`) before picking an option:

```python
print("A", "B", "C", sep="-")
print("Go", end="!")
print("Done")
```

## Output

```text
A-B-C
Go!Done
```

## Explanation

Trace how the terminal cursor moves line by line:

1. Line 1 prints three separate items with `sep="-"`, producing **`A-B-C`**. Because `end` was not overridden, it defaults to a newline (`\n`) and moves down to line 2.
2. Line 2 prints `"Go"` and replaces the normal newline ending with **`end="!"`**. So **`Go!`** appears and the cursor **stays on the same line** right after `!`.
3. Line 3 prints `"Done"` starting from that exact cursor position, forming **`Go!Done`**, and then moves to a new line.
