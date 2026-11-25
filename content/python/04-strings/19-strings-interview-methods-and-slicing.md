---
type: question
title: "How do .find() vs .index() and slicing vs indexing handle edge cases?"
difficulty: medium
mostAsked: true
tags: [interview, strings, edge-cases]
related:
  [
    python.strings.in-vs-find,
    python.strings.slicing-cut-a-piece,
    python.strings.indexing-pick-one-letter,
  ]
revision:
  - "Indexing past the end raises `IndexError`; slicing past the end clamps safely to empty/end"
  - "`.find()` returns `-1` when missing; `.index()` raises `ValueError`"
---

## Answer

Python handles missing items consistently across these two pairs:

- **Indexing (`s[99]`) vs Slicing (`s[99:]`):** Single-character indexing demands a real position, so an out-of-range index (or `""[0]`) raises `IndexError`. Slicing represents a **range**, so out-of-range bounds silently clamp without crashing (`"abc"[10:] == ""`).
- **`.find()` vs `.index()`:** `.find(sub)` returns `-1` when the substring is absent, while `.index(sub)` raises `ValueError`. Both return `0` when the substring is at the start, so never test `.find()` as a truthy boolean (`0` is falsy!).

A short answer for an interview: "Indexing crashes with `IndexError` out of bounds whereas slicing clamps gracefully; similarly, `.index()` raises `ValueError` on a miss whereas `.find()` returns `-1`."

## Why interviewers ask

This checks real-world Python fluency and whether you catch off-by-one, empty-string (`""`), and falsy-index-`0` bugs before shipping code.

## Follow-ups

- What does `"abc"[2:1]` return, and why?
- What happens if you try `s[::0]`?
- What is the trap with `"happy.py".rstrip(".py")`?
