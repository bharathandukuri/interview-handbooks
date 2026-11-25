---
type: concept
title: "Indexing: pick one character with [index]"
difficulty: easy
tags: [strings, indexing, basics]
related: [python.variables-and-types.text-basics]
revision:
  - "Python uses **zero-based indexing**: index `0` is the first character (`len(s) - 1` is the last)"
  - "**Negative indexing** counts from the right: `-1` is the last character"
  - "Spaces and punctuation count as characters; reading past either end raises `IndexError`"
---

A string (`str`) is an ordered sequence of **characters** (letters, digits, spaces, and punctuation). Each character sits at a numbered slot called an **index**.

Python uses **zero-based indexing** — index `0` means "0 steps from the start":

```text
text:    H   i       P   y   !
index:   0   1   2   3   4   5
back:   -6  -5  -4  -3  -2  -1
```

Put the **index** inside square brackets (`[ ]`, called the **subscript** or **indexing operator**) to grab a single character:

```python
text = "Hi Py!"
print(text[0])      # first character
print(text[2])      # space at index 2 is still a character!
print(text[-1])     # last character
print(text[-2])     # second from the end
```

The screen shows:

```text
H

!
y
```

**Important edge cases:**

- Spaces and symbols count just like letters, so `"Hi Py!"` has length `6` (`0` through `5`), and index `2` is `" "`.
- Negative indices let you read from the end without computing `len(text) - 1`.
- Asking for an index that is out of bounds (`text[6]`, `text[-7]`, or `""[0]` on an empty string) stops immediately with `IndexError: string index out of range`.
