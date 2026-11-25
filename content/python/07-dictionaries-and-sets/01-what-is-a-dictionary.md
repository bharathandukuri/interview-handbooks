---
type: concept
title: "Dictionaries: storing key-value pairs"
difficulty: easy
tags: [dicts, basics, data-structures, hashing]
related: [python.lists-and-tuples.list-vs-tuple]
revision:
  - "A **dictionary** (`dict`) stores **key-value pairs** inside `{key: value}`"
  - "Since Python 3.7+, dictionaries preserve **insertion order**"
  - "**Keys must be unique and hashable** (`str`, `int`, `tuple` of immutables); `list` cannot be a key (`TypeError`)"
---

Lists look up items by position (`nums[0]`). A **dictionary** (`dict`) lets you look up values by a meaningful **key** (name, ID, code) — just like looking up a word in a real dictionary.

```python
user = {"name": "Ada", "age": 36, "role": "engineer"}
empty = {}                         # empty dictionary (NOT an empty set!)

print(user["name"])                # lookup by key -> Ada
print(len(user))                   # number of key-value pairs -> 3
print("age" in user)               # checks KEYS only -> True
print("Ada" in user)               # False! ("Ada" is a value, not a key)
```

The screen shows:

```text
Ada
3
True
False
```

**Three essential rules for keys (and edge cases):**

- **Duplicate keys overwrite:** `{ "a": 1, "a": 2 }` keeps only the **last** value (`{"a": 2}`), because every key in a dict is unique.
- **Insertion order:** Since Python 3.7+, dicts remember the order keys were first inserted (`"name"`, `"age"`, `"role"`).
- **Keys must be hashable (unchanging):** Strings, ints, floats, `None`, and tuples of immutables work as keys. Mutable objects (`list`, `dict`, `set`) raise `TypeError: unhashable type: 'list'`.
