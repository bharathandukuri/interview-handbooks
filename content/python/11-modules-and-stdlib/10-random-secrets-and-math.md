---
type: concept
title: "Randomness vs security (random vs secrets) and exact math"
difficulty: easy
tags: [random, secrets, math, stdlib, security]
related: [python.modules-and-stdlib.importing-modules-and-packages]
---

Python gives you **three** separate modules for numbers and unpredictability — and choosing the wrong one in security code is a classic bug:

**1. `random` (for games, simulations, tests) vs `secrets` (for passwords, tokens, OTPs):**
`random` uses the **Mersenne Twister** algorithm. It is fast and great for shuffling cards or reproducible tests (`random.Random(seed)`), **but** an attacker observing a few hundred outputs can predict future outputs! Always use **`secrets`** (cryptographically secure randomness from your OS) for API keys, password resets, or session tokens:

```python
import math
import random
import secrets

# 1. Reproducible simulation with an isolated generator instance
rng = random.Random(42)
dice = [rng.randint(1, 6) for _ in range(4)]
picked = rng.sample(["ada", "bob", "lin", "sam"], k=2)   # without replacement
print("dice:", dice, "| picked:", picked)

# 2. Cryptographic token (output length is deterministic even though bytes are random!)
token = secrets.token_hex(8)         # 8 random bytes -> 16 hex characters
print("token hex len:", len(token))

# 3. Exact math helpers
print("isclose 0.1+0.2 == 0.3:", math.isclose(0.1 + 0.2, 0.3))
print("gcd/lcm(12, 18):", math.gcd(12, 18), math.lcm(12, 18))
print("exact isqrt:", math.isqrt(10**30 + 5))
```

The screen shows:

```text
dice: [6, 1, 1, 6] | picked: ['lin', 'ada']
token hex len: 16
isclose 0.1+0.2 == 0.3: True
gcd/lcm(12, 18): 6 36
exact isqrt: 1000000000000000
```

**Important edge cases:**

- **`random.sample(pop, k)` vs `random.choices(pop, k=...)`:** `.sample()` picks **without replacement** (no duplicates, raises `ValueError` if `k > len(pop)`); `.choices()` picks **with replacement** (allows repeats and optional `weights=`).
- **`random.shuffle(lst)` returns `None`:** Just like `lst.sort()`, `shuffle()` mutates `lst` **in place**!
- **Why `math.isqrt()` beats `int(math.sqrt(n))`:** `math.sqrt()` converts integers into 53-bit `float`s and silently loses precision above $2^{53}$, whereas `math.isqrt()` performs exact integer square root for arbitrarily huge integers!
- **Floating-point comparisons:** Remember `0.1 + 0.2 == 0.3` is `False` (Chapter 02); `math.isclose(a, b)` checks tolerance cleanly.
