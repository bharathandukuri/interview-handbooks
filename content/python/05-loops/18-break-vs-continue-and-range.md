---
type: question
title: "for vs while, break vs continue, and how range() saves memory"
difficulty: easy
mostAsked: true
tags: [interview, loops, range, break, continue]
related:
  [
    python.loops.for-vs-while,
    python.loops.break-and-continue,
    python.loops.loop-else,
  ]
revision:
  - "`for` steps through items or `range()`; `while` repeats while a condition remains `True`"
  - "`break` exits the loop completely; `continue` skips to the next iteration"
  - "`range(1_000_000_000)` uses tiny constant memory (**lazy**) — it computes each next number on demand"
---

## Answer

1. **`for` vs `while`:** Use **`for`** when walking over items (strings, collections) or a fixed count (`range`). Use **`while`** when repeating until a condition changes and the step count is unknown upfront (user retries, sentinel values).
2. **`break` vs `continue`:** **`break`** exits the innermost loop immediately (and skips any loop `else:`); **`continue`** skips only the rest of the current iteration and moves to the next turn.
3. **Why `range(1_000_000)` is fast and lightweight:** `range()` does **not** build a million integers in memory all at once — it stores only `start`, `stop`, and `step` and generates each next number **lazily** as the loop asks for it.

A short answer for an interview: "Use `for` over iterables or `range` when bounds are known, and `while` for condition-driven loops. `break` ends the loop immediately while `continue` skips to the next turn, and `range` uses constant O(1) memory because it generates numbers on demand."

## Why interviewers ask

It checks everyday control flow mastery, whether you watch for `while`/`continue` infinite loops, and whether you know `range()` is lazy rather than storing huge number lists.

## Follow-ups

- What happens in a `while` loop if you hit `continue` before updating your loop counter?
- When does a `for ... else` block run?
- Does `break` inside a nested loop exit both loops or only the inner one?
