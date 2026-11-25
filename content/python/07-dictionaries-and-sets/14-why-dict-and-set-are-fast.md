---
type: question
title: "Why are dictionaries and sets O(1) fast for lookups, and why must keys be hashable?"
difficulty: medium
mostAsked: true
tags: [interview, dicts, sets, hashing, complexity]
related: [python.dictionaries-and-sets.list-vs-set-vs-dict]
revision:
  - "Dicts and sets use **hash tables**: `hash(key)` jumps straight to the bucket instead of scanning every item"
  - "Keys must be **hashable** (never change hash value) so Python can always locate them in the same bucket"
---

## Answer

Checking `x in my_list` forces Python to inspect items one by one from index `0` until it finds `x` (**`O(n)` linear time**).

Checking `x in my_set` or `my_dict[k]` uses a **hash table** (**`O(1)` average constant time**):

1. Python passes your key into `hash(key)`, turning `"ada"` or `42` into an integer hash code.
2. That hash code calculates the exact slot index inside an underlying table, jumping straight there in one step — whether the dict has `10` entries or `10,000,000`!

**Why keys/set elements must be immutable (**hashable**):** If a mutable `list` were allowed as a key and you appended to it later, its contents (and hash!) would change, stranding it in the wrong slot where `my_dict[key]` could never find it again. That is why Python raises `TypeError: unhashable type` upfront.

A short answer for an interview: "Dictionaries and sets store entries in hash tables, using `hash(key)` to jump straight to a slot in O(1) average time instead of scanning O(n) elements. Keys must be immutable/hashable so their hash slot never changes after insertion."

## Why interviewers ask

Hash-map and hash-set tradeoffs sit at the heart of almost every Python coding interview (Two Sum, deduplication, caching, counting).

## Follow-ups

- Can a tuple like `([1, 2], "a")` be a dictionary key? (No — all nested elements inside a tuple must also be immutable!)
- What happens if two different keys produce the same hash index (**hash collision**)? (Chapter 14 explains CPython's open addressing!)
