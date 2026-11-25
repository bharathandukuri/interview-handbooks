---
type: problem
title: "Fix a nested config cloning bug with deep copying"
difficulty: easy
complexity:
  time: "O(N) where N is total nested values in template"
  space: "O(N) for the cloned structure"
approach: "Replace shallow template.copy() with copy.deepcopy(template), apply overrides cleanly, and avoid cross-tenant list mutation"
tags: [internals, copying, bugs, practice]
related: [python.how-python-works-inside.shallow-vs-deep-copy]
---

## Problem

You are given a `build_profile(base_template, username, extra_role=None)` helper whose old implementation used `profile = base_template.copy()`. Because `base_template` has nested mutable values (`{"roles": ["viewer"], "limits": {"api_calls": 100}}`), adding a role to one user accidentally gave **every future user** admin privileges!

Fix `build_profile` cleanly so:

- Mutating the returned profile's `"roles"` list or `"limits"` dictionary **never** touches `base_template` or other users' profiles.
- Optional `extra_role` is appended only if provided and not already present.

## Hint

- Use `copy.deepcopy(base_template)` to isolate nested dicts and lists at every depth.
- Update `profile["username"] = username` and `if extra_role and extra_role not in profile["roles"]: profile["roles"].append(extra_role)`.

## Solution

```python
import copy

BASE_TEMPLATE = {
    "username": "guest",
    "roles": ["viewer"],
    "limits": {"api_calls": 100},
}

def build_profile(base_template, username, extra_role=None):
    profile = copy.deepcopy(base_template)
    profile["username"] = username
    if extra_role and extra_role not in profile["roles"]:
        profile["roles"].append(extra_role)
    return profile

ada = build_profile(BASE_TEMPLATE, "ada", extra_role="admin")
bob = build_profile(BASE_TEMPLATE, "bob")
ada["limits"]["api_calls"] = 5000

print("BASE:", BASE_TEMPLATE)
print("ada: ", ada)
print("bob: ", bob)
```

## Walkthrough

Because `BASE_TEMPLATE.copy()` only copies top-level dictionary keys, `ada["roles"]` and `ada["limits"]` would have shared memory with `BASE_TEMPLATE` and `bob`! `copy.deepcopy(base_template)` clones every nested list and nested dictionary recursively so neither `roles` nor `limits` ever leaks across users.
