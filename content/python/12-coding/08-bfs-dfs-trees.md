---
type: problem
title: "Binary Tree Level-Order BFS & DFS"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n)"
  space: "O(n)"
approach: "deque BFS"
tags: [trees, bfs, deque]
revision:
  - "Use `collections.deque` for O(1) `popleft()` in BFS level-order traversal"
  - "Snapshot `len(queue)` at the start of each level to group nodes by depth"
---

## Problem

Given the root of a binary tree (`TreeNode(val, left, right)`), return its level-order traversal as a list of levels from top to bottom.

```
Input:  [3, 9, 20, null, null, 15, 7]
Output: [[3], [9, 20], [15, 7]]
```

## Hint

- A regular `list.pop(0)` is O(n) — use `collections.deque` for O(1) `popleft()`.

## Solution

```python
from collections import deque

def level_order(root) -> list[list[int]]:
    if root is None:
        return []
    levels: list[list[int]] = []
    q = deque([root])
    while q:
        level: list[int] = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        levels.append(level)
    return levels
```

## Walkthrough

Snapshot `len(q)` at the start of each outer loop iteration so the inner loop processes **only** the nodes belonging to the current depth while appending their children for the next depth. Each node enters and leaves `q` once (O(n) time).
