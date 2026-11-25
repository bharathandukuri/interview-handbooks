---
type: problem
title: "Two pointers pattern: 3Sum (deduplicated triplets summing to zero)"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n^2) after O(n log n) initial sort"
  space: "O(1) extra excluding sorted output (Timsort uses up to O(n) worst-case)"
approach: "Sort array, anchor i skipping duplicates, and converge left/right two pointers skipping matching neighbors"
tags: [interviews, two-pointers, sorting, arrays]
related:
  [
    python.dictionaries-and-sets.two-sum,
    python.interview-problem-set.interview-pattern-playbook,
  ]
revision:
  - "Sort `nums` first so duplicate skipping (`nums[i] == nums[i - 1]`) and two-pointer narrowing (`left += 1`, `right -= 1`) happen deterministically"
  - "Prune early if `nums[i] > 0`: sorted remaining numbers are positive and can never sum to `0`!"
---

## Problem

Given an integer list `nums`, return all **unique triplets** `[a, b, c]` (from distinct indices) such that `a + b + c == 0`. No duplicate triplets are allowed in the result.

Edge cases:

- Fewer than 3 items `[0, 1]` or `[]` -> `[]`
- All zeros `[0, 0, 0, 0]` -> `[[0, 0, 0]]`
- Negative & duplicate clusters `[-1, 0, 1, 2, -1, -4]` -> `[[-1, -1, 2], [-1, 0, 1]]`

## Hint

- Do not mutate the caller's list in place (`sorted(nums)` builds a fresh sorted copy).
- Anchor `i` from `0` to `n - 3`:
  - If `nums[i] > 0`, `break` early (impossible for 3 non-negative sorted ints with first `> 0` to sum to `0`).
  - If `i > 0 and nums[i] == nums[i - 1]: continue` (skip duplicate anchor values).
- Run `left = i + 1`, `right = len(nums) - 1`: adjust `left` / `right` by sum vs `0`, and on match record `[nums[i], nums[left], nums[right]]` then advance past duplicate `left` and `right` values!

## Solution

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    arr = sorted(nums)
    n = len(arr)
    triplets: list[list[int]] = []

    for i in range(n - 2):
        if arr[i] > 0:
            break
        if i > 0 and arr[i] == arr[i - 1]:
            continue

        left, right = i + 1, n - 1
        while left < right:
            total = arr[i] + arr[left] + arr[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                triplets.append([arr[i], arr[left], arr[right]])
                left += 1
                right -= 1
                while left < right and arr[left] == arr[left - 1]:
                    left += 1
                while left < right and arr[right] == arr[right + 1]:
                    right -= 1
    return triplets

print(three_sum([-1, 0, 1, 2, -1, -4]))
print(three_sum([0, 0, 0, 0]))
print(three_sum([1, 2]))
```

## Walkthrough

Notice how sorting + skipping adjacent equal values handles `[0, 0, 0, 0]` in **`O(n^2)`** without storing hash sets of tuples:

- At `i = 0`, `arr[0] = 0`, `left = 1, right = 3` finds `[0, 0, 0]`, advances `left` past duplicates until `left >= right`.
- At `i = 1`, `arr[1] == arr[0]` skips `i = 1` cleanly, guaranteeing `[0, 0, 0]` appears **only once**.
- Guarding `arr[i] > 0: break` avoids scanning pointless positive triples!
