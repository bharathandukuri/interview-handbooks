---
type: compare
title: "Composition vs Inheritance: has-a vs is-a design"
difficulty: medium
mostAsked: true
left: "Composition (has-a)"
right: "Inheritance (is-a)"
tags: [oop, architecture, design-patterns, clean-code]
related: [python.oop.inheritance-and-super, python.oop.duck-typing-and-abc]
revision:
  - "**Inheritance (`is-a`):** tightly couples child to parent internals; risky for deep hierarchies"
  - "**Composition (`has-a`):** stores collaborator objects as attributes, making swapping, testing, and refactoring easy"
---

When sharing behavior between classes, beginners often reach straight for inheritance (`class ReportMailer(PdfBuilder, EmailSender)`), creating rigid hierarchies that break when requirements change. Comparing the two styles reveals why experienced engineers favor **composition over inheritance**:

| Dimension               | Composition (`obj.engine` / "has-a")             | Inheritance (`class Car(Engine)` / "is-a")       |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------ |
| Core relationship       | A `NotificationService` **has a** `Sender`       | A `SavingsAccount` **is a** `BankAccount`        |
| Flexibility at runtime  | ✅ Swap sender (`EmailSender` -> `SmsSender`)    | ❌ Fixed when the class is defined               |
| Fragile base-class risk | ✅ Low — talks only through public methods       | ⚠️ High — parent changes can silently break kids |
| Ease of unit testing    | ✅ Inject a fake `Sender` directly in `__init__` | Harder if subclass overrides partial hooks       |
| Best use case           | Assembling services, strategies, pipelines       | True specialization + small, clean taxonomies    |

## Verdict

Always ask: **"Is X truly a specialized kind of Y, OR does X simply use Y to get a job done?"** Keep inheritance hierarchies shallow (1–2 levels) for genuine **"is-a"** types or small `ABC` contracts, and reach for **composition** (`self.sender = sender`) whenever behaviors might vary or be mocked in tests!
