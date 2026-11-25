---
type: concept
title: "Converting between strings and lists: .split() and .join()"
difficulty: easy
mostAsked: true
tags: [lists, strings, methods, edge-cases]
related: [python.strings.find-count-and-replace]
revision:
  - "`text.split()` splits text into a **list** of substrings; default splits on any whitespace and drops extra spaces"
  - "`sep.join(words)` glues a list of **strings** back into one string cleanly and fast"
  - '**Edge case:** `", ".join([1, 2])` raises `TypeError` — convert non-strings with `str()` first'
---

Two methods bridge the **Strings** chapter (Chapter 4) and **Lists**: **`.split()`** cuts a string into a `list`, and **`.join()`** glues a `list` of strings back into one string.

```python
sentence = "  learn   python  fast  "
words = sentence.split()             # no argument: splits on whitespace runs!
print(words)

csv = "a,,b,"
print(csv.split(","))                # explicit separator keeps empty pieces!

joined = " | ".join(words)           # glue list of strings together
print(joined)
```

The screen shows:

```text
['learn', 'python', 'fast']
['a', '', 'b', '']
learn | python | fast
```

**Critical edge cases to know:**

1. **`.split()` vs `.split(" ")`:** Calling `.split()` with **no argument** splits on runs of spaces/tabs/newlines and strips leading/trailing space automatically (`"  a   b ".split()` -> `['a', 'b']`). Passing an explicit single space `.split(" ")` treats every space strictly and leaves empty strings `""`!
2. **`.join()` requires strings only:** `"-".join(["a", 2])` stops with `TypeError: sequence item 1: expected str instance, int found`. Convert numbers first!
3. **Why `.join()` beats `+=` in loops:** Joining 10,000 words with `out += word` makes 10,000 copies because strings are immutable; putting parts in a list and calling `"".join(parts)` allocates once.
