---
type: problem
title: "Chapter challenge: Two Sum"
difficulty: easy
mostAsked: true
complexity:
  time: "O(n) single pass"
  space: "O(n) dictionary storage"
approach: "Store value -> index in a dict while looking up target - n"
tags: [dicts, hash-map, interview, edge-cases, practice]
related:
  [
    python.dictionaries-and-sets.what-is-a-dictionary,
    python.dictionaries-and-sets.list-vs-set-vs-dict,
  ]
revision:
  - "Single pass: for each `(i, n)` compute `need = target - n` and check `if need in seen:` **before** inserting `seen[n] = i`"
  - "Dictionary lookup avoids the slow `O(n^2)` nested loop and prevents reusing the same element twice (`nums=[3, 2, 4], target=6`)"
---

## Problem

Given a list of integers `nums` and an integer `target`, print the two indices `[i, j]` (`i != j`) whose numbers add up to `target` (assume at most one answer exists). Handle duplicate values like `[3, 3]` with `target = 6`, and avoid matching a number with itself (like `3 + 3 = 6` in `[3, 2, 4]`).

```text
nums = [2, 7, 11, 15], target = 9  -> [0, 1]
nums = [3, 2, 4],      target = 6  -> [1, 2]
nums = [3, 3],         target = 6  -> [0, 1]
```

## Hint

- Using nested loops checks every pair in slow `O(n^2)` time. How can a dictionary check if the missing partner already appeared in `O(1)`?
- At index `i` with value `n`, the missing partner is `need = target - n`.
- Check `if need in seen:` **before** storing `seen[n] = i`! Why does that handle both `[3, 2, 4]` and `[3, 3]`?

## Solution

```python
nums = [3, 3]
target = 6
seen = {}           # maps value -> index where we saw it
answer = []

for i in range(len(nums)):
    n = nums[i]
    need = target - n
    if need in seen:
        answer = [seen[need], i]
        break
    seen[n] = i

print(answer)
```

## Walkthrough

Trace the two tricky edge cases:

- **`[3, 2, 4]`, `target = 6`:** At `i = 0` (`n = 3`), `need = 3`. `seen` is still empty `{}`, so it does NOT match `3` with itself — it saves `seen[3] = 0`. At `i = 1` (`2`), `seen[2] = 1`. At `i = 2` (`4`), `need = 2` IS in `seen`, giving `[1, 2]`!
- **`[3, 3]`, `target = 6`:** At `i = 0`, `seen[3] = 0`. At `i = 1`, `need = 3` finds index `0` before overwriting `seen[3]`, giving `[0, 1]` cleanly!
- **Why this matters in interviews:** A dictionary turns an `O(n^2)` double loop into instant `O(n)` single-pass lookup!
