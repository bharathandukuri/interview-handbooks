---
type: concept
title: "Running external commands safely with `subprocess`"
difficulty: medium
tags: [subprocess, stdlib, security]
---

Use `subprocess.run()` (never deprecated `os.system()` or `os.popen()`) to invoke external CLI tools cleanly and securely.

```python
import subprocess

res = subprocess.run(
    ["git", "status", "--short"],   # list of args — NO shell=True!
    capture_output=True,
    text=True,
    timeout=10,
    check=True,                     # raises CalledProcessError on non-zero exit
)
print(res.stdout)
```

**Best practices:**

- **Pass an argument list, not a string (`shell=False` default):** Prevents shell injection if any argument comes from user input.
- **`check=True`:** Fails loudly on non-zero exit codes instead of silently continuing.
- **`timeout=`:** Prevents external commands from hanging your worker indefinitely.
- For streaming large output or interactive pipes, use `subprocess.Popen` inside a `with` block or `asyncio.create_subprocess_exec`.
