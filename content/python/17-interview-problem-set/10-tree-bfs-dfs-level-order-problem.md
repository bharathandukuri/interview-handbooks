---
type: problem
title: "Trees pattern: BFS Level Order and DFS Validate BST"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n) visiting every tree node once"
  space: "O(w) queue width for BFS / O(h) recursion stack height for DFS"
approach: "Use collections.deque snapshot per tree level for BFS; pass strict (low, high) ancestor bounds down recursive DFS for BST validation"
tags: [interviews, trees, bfs, dfs]
related:
  [
    python.modules-and-stdlib.collections-counter-defaultdict-deque,
    python.functions.recursion-basics,
  ]
revision:
  - "Level-order BFS loops `for _ in range(len(queue)):` to group exactly one depth level per list"
  - "Validating a BST CANNOT just compare `node.left.val < node.val` — pass strict `(low, high)` bounds from **every ancestor** (`-math.inf < val < +math.inf`)"
---

## Problem

Given a binary tree made of `TreeNode(val, left=None, right=None)`:

1. **`level_order(root)`:** Return values grouped level-by-level from top to bottom (`None` -> `[]`).
2. **`is_valid_bst(root)`:** Return `True` only if every node in the left subtree is **strictly less** than `node.val` and every node in the right subtree is **strictly greater** than `node.val`.

Edge case trap for `is_valid_bst`: `[5, 4, 6, None, None, 3, 7]` has `3 < 6` locally, **yet** `3` lives inside `5`'s _right_ subtree (`3 < 5` violates BST rules!) -> must return `False`!

## Hint

- For `level_order`: put `root` inside `deque([root])` (if not `None`); at each step capture `level_size = len(q)` and pop exactly `level_size` nodes before moving to the next level!
- For `is_valid_bst`: write `_check(node, low, high)` starting with `(-math.inf, math.inf)` — going left tightens upper bound to `node.val`, going right tightens lower bound to `node.val`.

## Solution

```python
from collections import deque
from dataclasses import dataclass
import math

@dataclass(slots=True)
class TreeNode:
    val: int
    left: "TreeNode | None" = None
    right: "TreeNode | None" = None

def level_order(root: TreeNode | None) -> list[list[int]]:
    if root is None:
        return []
    levels: list[list[int]] = []
    q: deque[TreeNode] = deque([root])
    while q:
        level: list[int] = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left is not None:
                q.append(node.left)
            if node.right is not None:
                q.append(node.right)
        levels.append(level)
    return levels

def is_valid_bst(root: TreeNode | None, low: float = -math.inf, high: float = math.inf) -> bool:
    if root is None:
        return True
    if not (low < root.val < high):
        return False
    return is_valid_bst(root.left, low, root.val) and is_valid_bst(root.right, root.val, high)

valid_tree = TreeNode(5, TreeNode(3, TreeNode(1), TreeNode(4)), TreeNode(7))
tricky_bad = TreeNode(5, TreeNode(4), TreeNode(6, TreeNode(3), TreeNode(7)))
print("levels:", level_order(valid_tree), "| empty:", level_order(None))
print("valid BST?", is_valid_bst(valid_tree), "| tricky trap?", is_valid_bst(tricky_bad))
```

## Walkthrough

Notice how **`low < root.val < high`** catches `3` sitting under `6` in `tricky_bad`: moving right from root `5` passed `low=5`, moving left from `6` tightened `high=6`, so node `3` failed `5 < 3 < 6` immediately!

Also note the BFS space complexity edge case: on a wide balanced tree, the bottom level holds up to `~n / 2` nodes (`O(n)` queue memory), whereas balanced DFS recursion uses only `O(log n)` stack frames (up to `O(n)` if skewed like a linked list!).
