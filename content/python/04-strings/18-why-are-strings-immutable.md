---
type: question
title: "Why are strings immutable in Python?"
difficulty: easy
mostAsked: true
tags: [interview, strings, immutability]
related: [python.strings.strings-never-change]
revision:
  - "Immutable strings cannot change characters in place once created in memory"
  - "This guarantees hashability (dictionary keys), safe variable aliasing, and memory optimization (**interning**)"
---

## Answer

A string is **immutable**, meaning once created in memory, its characters cannot be altered. Any operation that transforms text (`.lower()`, `.replace()`, `+`, slicing) constructs and returns a **brand-new string object**.

There are three key reasons Python designs strings this way:

1. **Hashability for dictionaries and sets:** In Chapters 6–7 you will use strings as **dictionary keys** (`user["name"]`). Dictionary keys must never mutate while stored in a hash table, otherwise Python could never find the key again!
2. **Safe sharing across variables:** Because strings cannot change in place, two variables referencing `"admin"` can never corrupt each other.
3. **Memory reuse (**interning**):** Python can safely cache and share common strings (like variable names or short identifiers) across your program in one place.

A short answer for an interview: "Strings are immutable so their hash value never changes — making them safe as dictionary keys — and so multiple variables can share the same string object safely."

## Why interviewers ask

It connects day-to-day string syntax to Python's object model and sets up why `list` vs `tuple` and `dict` key rules behave the way they do.

## Follow-ups

- What error happens if you run `s[0] = "A"`?
- Why is joining 10,000 small strings inside a loop with `+=` inefficient if strings are immutable? (Answered in Chapter 6 with `"".join(...)`!)
