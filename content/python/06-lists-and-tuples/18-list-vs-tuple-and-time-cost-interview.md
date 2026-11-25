---
type: question
title: "When do you pick a tuple over a list, and why is list.pop(0) slower than list.pop()?"
difficulty: medium
mostAsked: true
tags: [interview, lists, tuples, complexity]
related:
  [
    python.lists-and-tuples.list-vs-tuple,
    python.lists-and-tuples.stack-and-queue-with-lists,
  ]
revision:
  - "Tuples signal fixed immutable data and can be hashed as dict keys / set elements"
  - "`list.pop()` is `O(1)` at the tail; `list.pop(0)` shifts all `n - 1` items (`O(n)`)"
---

## Answer

**1. Tuple vs List:** Use a **`list`** for dynamic, homogeneous collections that change (tasks, search results), and a **`tuple`** for fixed records (`(x, y)`, `(host, port)`) or whenever an immutable, **hashable** sequence is needed (dictionary keys, set elements).

**2. `pop()` vs `pop(0)`:** Python lists are implemented internally as contiguous **dynamic arrays** of object pointers:

- `lst.append(x)` and `lst.pop()` work at the **end** in **O(1)** amortized time because no elements move.
- `lst.insert(0, x)` and `lst.pop(0)` work at the **front**, forcing Python to shift every remaining element in memory — taking **O(n)** linear time.

A short answer for an interview: "Pick tuples for fixed records or hashable dict keys, and lists for growing collections. Lists are O(1) at the tail (`append`/`pop`), while front operations (`pop(0)`) shift every item in O(n) — use `collections.deque` when you need a fast queue."

## Why interviewers ask

It tests whether you understand Python's built-in array representation and how container choices directly affect both correctness (hashability) and performance (`O(1)` vs `O(n)`).

## Follow-ups

- How do you write a 1-element tuple (`(x,)`)?
- Can a tuple contain a mutable list inside it, and if so, can that tuple still be used as a dictionary key? (No — `TypeError: unhashable type: 'list'`!)
