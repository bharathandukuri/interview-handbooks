---
type: concept
title: "Lists: ordered collections that can grow and change"
difficulty: easy
tags: [lists, basics, indexing, slicing]
related:
  [python.strings.indexing-pick-one-letter, python.strings.slicing-cut-a-piece]
revision:
  - "A **list** (`[...]`) holds an ordered sequence of **elements** and allows duplicates"
  - "Indexing (`nums[0]`, `nums[-1]`) and slicing (`nums[1:3]`, `nums[::-1]`) work identically to strings"
  - "`[]` is an empty list (`len([]) == 0`, falsy in `if` checks)"
---

So far, each variable held one value at a time (one number or one string). A **list** lets you store an ordered collection of items (called **elements**) under a single name inside square brackets `[ ]`, separated by commas.

```python
fruits = ["apple", "banana", "cherry", "apple"]   # duplicates are allowed
mixed = [42, "hello", True, 3.14]                 # elements can be different types
empty = []                                        # empty list

print(len(fruits))       # 4
print(fruits[0])         # first item -> apple
print(fruits[-1])        # last item -> apple
print(fruits[1:3])       # slice -> ['banana', 'cherry'] (always returns a new list!)
print("banana" in fruits)# membership check -> True
```

The screen shows:

```text
4
apple
apple
['banana', 'cherry']
True
```

You can loop straight over elements with `for fruit in fruits:`, check length with `len()`, and slice cleanly.

**Edge cases to watch:**

- Just like strings, `empty[0]` raises `IndexError: list index out of range`, while `empty[0:5]` safely returns `[]`.
- An empty list `[]` is **falsy** (`if not items:`), while `[0]` or `[False]` is **truthy** because it contains 1 element!
