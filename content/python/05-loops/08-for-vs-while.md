---
type: compare
title: "for loop vs while loop: choosing the right tool"
difficulty: easy
left: "for loop"
right: "while loop"
tags: [loops, for, while]
related: [python.loops.range-count-numbers, python.loops.while-loop]
revision:
  - "Choose `for` when iterating over known counts (`range`) or items (strings, collections)"
  - "Choose `while` when repeating until a runtime condition or user input changes"
---

Both `for` and `while` repeat code, but each fits a different kind of problem cleanly:

| Feature            | `for` loop                               | `while` loop                                   |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| Best used when     | Known count (`range`) or walking items   | Unknown count; stop when condition changes     |
| Typical example    | `for ch in word:` / `for i in range(n):` | `while guess != secret:`                       |
| Progress update    | Automatic on every iteration             | You must update state manually                 |
| Infinite loop risk | Minimal (stops when iterable ends)       | High if counter update is forgotten or skipped |
| Input retry loops  | Awkward (`range` has a fixed cap)        | ✅ Natural fit                                 |

## Verdict

Reach for **`for`** by default whenever you know what sequence or number range you are stepping through — it is shorter, cleaner, and cannot accidentally forget to advance to the next item. Reach for **`while`** when waiting on external/user conditions (`while not done:`, game loops, retry validation) where you cannot predict the number of iterations upfront.
