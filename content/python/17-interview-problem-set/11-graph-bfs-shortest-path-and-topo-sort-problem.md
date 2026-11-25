---
type: problem
title: "Graphs pattern: Topological Sort & Cycle Detection (Kahn's BFS)"
difficulty: medium
mostAsked: true
complexity:
  time: "O(V + E) where V is vertices (courses) and E is prerequisite edges"
  space: "O(V + E) for adjacency list, indegree counts, and BFS queue"
approach: "Build directed graph + indegree array, seed queue with zero-indegree nodes, peel edges iteratively, and detect cycles if len(order) < V"
tags: [interviews, graphs, bfs, topological-sort]
related: [python.interview-problem-set.tree-bfs-dfs-level-order-problem]
revision:
  - "**Kahn's algorithm** resolves dependency order in **`O(V + E)`** without recursion limits (`RecursionError`)"
  - "If a directed graph contains a **cycle**, `len(order) < num_nodes` at the end -> return `[]` cleanly!"
---

## Problem

You have `num_courses` labeled `0 .. num_courses - 1` and a list of `[course, prereq]` pairs (meaning `prereq` **must come before** `course`).

Write `find_course_order(num_courses, prerequisites)` returning a valid order to finish **every** course — or `[]` if a circular dependency (**cycle**) makes finishing impossible!

Edge cases:

- `num_courses <= 0` -> `[]`
- `prerequisites = []` (disconnected courses) -> `[0, 1, ..., num_courses - 1]`
- Cycle `[0, 1], [1, 0]` -> `[]`

## Hint

- Directed edge direction matters carefully: `[course, prereq]` creates edge **`prereq -> course`** and increments **`indegree[course] += 1`**!
- Start `deque` with every course having `indegree == 0`.
- Pop `u`, append `u` to `order`, decrement `indegree[v]` for each neighbor `v`, and enqueue `v` when `indegree[v] == 0`.
- After the loop, return `order if len(order) == num_courses else []`.

## Solution

```python
from collections import deque

def find_course_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    if num_courses <= 0:
        return []
    adj: list[list[int]] = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses

    for course, prereq in prerequisites:
        adj[prereq].append(course)
        indegree[course] += 1

    q = deque(i for i in range(num_courses) if indegree[i] == 0)
    order: list[int] = []

    while q:
        curr = q.popleft()
        order.append(curr)
        for nxt in adj[curr]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)

    return order if len(order) == num_courses else []

print("valid:", find_course_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
print("cycle:", find_course_order(2, [[1, 0], [0, 1]]))
print("no edges:", find_course_order(3, []))
```

## Walkthrough

Notice why Kahn's iterative BFS beats naive recursive DFS on big build/dependency graphs:

1. Even with 100,000 chained dependencies, an iterative `deque` will never blow Python's 1,000-frame recursion limit!
2. Any nodes trapped inside (or downstream of) a cycle never drop to `indegree == 0`, so checking `len(order) == num_courses` detects cycles across disconnected components automatically in `O(1)`.
3. Need shortest path in an **unweighted** undirected graph instead? The exact same `deque` BFS + a **`visited` `set` added at enqueue time** (so the same node is never pushed twice!) finds shortest step counts cleanly in `O(V + E)`.
