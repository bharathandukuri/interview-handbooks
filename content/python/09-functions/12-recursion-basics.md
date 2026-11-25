---
type: concept
title: "Recursion, the call stack, and RecursionError"
difficulty: medium
mostAsked: true
tags: [functions, recursion, call-stack]
related:
  [
    python.functions.defining-and-calling-functions,
    python.functions.factorial-recursive-and-iterative,
  ]
revision:
  - "Every recursive function needs a **base case** (stops recursion) and a **recursive case** (moves toward the base case)"
  - "Each active call uses a frame on the **call stack**; missing or unreachable base cases raise **`RecursionError`**"
  - "Python does **not** perform tail-call optimization, so deep linear chains belong in loops"
---

**Recursion** happens when a function solves a problem by calling **itself** on a smaller piece of the same problem.

Every working recursive function has two essential parts:

1. **Base case:** A simple input whose answer is known immediately, with **no** recursive call. Without a base case, the function calls itself forever!
2. **Recursive case:** Breaks the problem down into a **smaller** subproblem and calls itself, moving step by step toward the base case.

```python
def sum_list(nums):
    if not nums:                  # BASE CASE: empty list has sum 0
        return 0
    return nums[0] + sum_list(nums[1:])   # RECURSIVE CASE: smaller list!

print(sum_list([4, 7, 2]))
print(sum_list([]))
```

The screen shows:

```text
13
0
```

**How Python tracks active calls (the call stack):**
Each time `sum_list` calls itself, Python pauses the outer call and places a new **stack frame** (holding that call's own local `nums`) on top of the **call stack**. For `[4, 7, 2]`:

1. `sum_list([4, 7, 2])` waits for `4 + sum_list([7, 2])`
2. `sum_list([7, 2])` waits for `7 + sum_list([2])`
3. `sum_list([2])` waits for `2 + sum_list([])`
4. `sum_list([])` hits the base case and returns `0` — now the stack unwinds back up (`0 -> 2 -> 9 -> 13`)!

**Important limits and edge cases:**

- **Stack overflow (`RecursionError`):** Because each call stays paused in memory, Python caps recursion depth (around `1000` nested calls by default, inspectable via `sys.getrecursionlimit()` in Chapter 11). If the base case is missing or never reached (for example calling `countdown(-1)` when the base case checks `n == 0` instead of `n <= 0`), Python stops with **`RecursionError: maximum recursion depth exceeded`**.
- **No tail-call optimization (TCO):** Unlike some functional languages, Python does **not** erase the old stack frame even when the recursive call is the last statement. Also notice `nums[1:]` above copies a list slice on every call (`O(n^2)` total work); for simple linear sequences use a **`for`/`while` loop** (`O(1)` stack space), and save recursion for **trees**, **graphs**, and **divide-and-conquer** algorithms!
