---
type: concept
title: "Accumulators and counters: keeping a running total"
difficulty: easy
tags: [loops, patterns, variables]
related:
  [
    python.operators-and-decisions.update-in-place,
    python.loops.for-loop-and-strings,
  ]
revision:
  - "An **accumulator** (`total = 0`) adds values across iterations; a **counter** (`count = 0`) counts matches"
  - "Always **initialize** accumulators and counters **before** the loop starts — never inside it"
---

One of the most useful loop patterns is tracking an **accumulator** (a running total that combines values across turns) or a **counter** (counting how many times a check passes).

The golden rule: **initialize your variable (`= 0`) BEFORE the loop starts**, then update it with `+=` inside the loop body.

```python
word = "bananas"
a_count = 0                  # counter initialized BEFORE the loop

for ch in word:
    if ch == "a":            # indented inside `for` (4 spaces)
        a_count += 1         # indented inside `if` (8 spaces)

print(f"Found {a_count} letter 'a's")
```

The screen shows:

```text
Found 3 letter 'a's
```

**Why initializing inside the loop breaks your program:**
If you accidentally put `a_count = 0` inside the `for` block, Python resets `a_count` back to `0` on **every single iteration**! At the end of `"bananas"`, `a_count` would hold `0` (or at most `1` if the very last character matched).

**Edge case — empty input:** Starting `a_count = 0` before the loop guarantees that if `word` is `""`, the loop runs `0` times and `a_count` safely remains `0` instead of raising `NameError`.
