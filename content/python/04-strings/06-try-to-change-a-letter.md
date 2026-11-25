---
type: pitfall
title: "Trying to change one character in a string"
difficulty: easy
tags: [strings, gotchas, immutability]
related: [python.strings.strings-never-change]
revision:
  - "`word[0] = 'J'` raises `TypeError` because strings forbid item assignment"
  - "Build a fresh string instead: `word = 'J' + word[1:]`"
---

## The trap

```python
word = "java"
word[0] = "J"
```

Python stops immediately with:

```text
TypeError: 'str' object does not support item assignment
```

## The fix

```python
word = "java"
word = "J" + word[1:]
print(word)
# Java
```

## Why it happens

Python treats every `str` in memory as fixed and read-only. Item assignment (`word[0] = "J"`) tries to reach inside an existing string and overwrite byte/character `0`, which Python blocks with `TypeError`.

Combining `"J"` with the slice `word[1:]` (`"ava"`) constructs a brand-new string `"Java"` and moves the name `word` onto it. (For an empty string edge case `word = ""`, `word[1:]` safely returns `""`!)
