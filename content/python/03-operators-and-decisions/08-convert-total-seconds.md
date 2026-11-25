---
type: problem
title: "Convert total seconds to hours, minutes and seconds"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Combine // and % step by step"
tags: [operators, maths, practice]
related:
  [
    python.operators-and-decisions.maths-operators,
    python.operators-and-decisions.slash-vs-double-slash,
  ]
---

## Problem

Ask the user for a total number of seconds, and break it into whole **hours**, **minutes**, and leftover **seconds**.

```text
Total seconds: 3735
1 hours, 2 minutes and 15 seconds
```

```text
Total seconds: 45
0 hours, 0 minutes and 45 seconds
```

(The input number is what the user types. Notice how `45` and exact multiples like `3600` work cleanly without special `if` code.)

## Hint

- `1` hour is `3600` seconds (`60 * 60`).
- Use `total // 3600` to get whole hours, and `total % 3600` to get the leftover seconds after removing whole hours.
- Divide those leftover seconds by `60` using `//` and `%` for minutes and seconds.

## Solution

```python
total = int(input("Total seconds: "))
hours = total // 3600
remaining = total % 3600
minutes = remaining // 60
seconds = remaining % 60

print(hours, "hours,", minutes, "minutes and", seconds, "seconds")
```

## Walkthrough

Trace `total = 3735`:

1. `3735 // 3600` gives `1` whole hour.
2. `3735 % 3600` leaves `135` seconds (`remaining = 135`).
3. `135 // 60` gives `2` whole minutes.
4. `135 % 60` leaves `15` leftover seconds.

**Edge cases:** If the user types `0` or `45` (`< 60`), `// 3600` and `// 60` give `0` cleanly, and `% 60` keeps `0` or `45`. Note that for negative durations (`-5`), floor division gives negative hours (`-1`), so in a real app you would check `total < 0` with an `if`.
