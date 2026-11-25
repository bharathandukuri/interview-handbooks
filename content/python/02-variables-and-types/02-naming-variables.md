---
type: concept
title: "Naming variables: the rules"
difficulty: easy
tags: [variables, naming, basics]
revision:
  - "Use letters, digits and underscores, and do not start with a digit"
  - "Names are case sensitive: `age` and `Age` are different"
  - "Write names in snake_case"
---

You can pick almost any name for a variable, but there are a few rules.

1. Use only letters, digits and underscores (`_`).
2. Do not start with a digit.
3. No spaces and no dashes.
4. Capital letters matter. `age` and `Age` are two different names.
5. Do not use words Python already owns, like `if`, `for`, `class` or `True`.

| Name          | Allowed? | Why                                    |
| ------------- | -------- | -------------------------------------- |
| `total_price` | Yes      | Letters and an underscore              |
| `score2`      | Yes      | A digit is fine, just not at the start |
| `2nd_place`   | No       | It starts with a digit                 |
| `my-name`     | No       | A dash is not allowed                  |
| `first name`  | No       | A space is not allowed                 |
| `class`       | No       | Python already uses this word          |

:::tip[Style]
Write names in `snake_case`: small letters with underscores. Pick names that say what the value is. `total_price` is better than `tp`.
:::
