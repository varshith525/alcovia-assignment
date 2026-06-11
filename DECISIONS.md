# DECISIONS

## Overview

This project implements an offline-first study platform consisting of:

* Focus Sessions
* Syllabus Progress Tracking
* Multi-device Synchronization
* n8n Automation

The primary design goal was to ensure that user actions work without internet connectivity and eventually synchronize correctly across devices.

---

# Data Model

The system uses an Operation Log architecture.

Every user action is represented as an immutable operation.

Examples:

```json
{
  "id": "1781194431235",
  "type": "focus_session",
  "status": "success"
}
```

```json
{
  "id": "1781190134316",
  "type": "task_update",
  "taskId": "m1",
  "status": "done",
  "version": 1781190134316
}
```

Operations are stored locally first and synchronized later.

---

# Offline First Strategy

The application never depends on immediate backend availability.

When a user performs an action:

1. Store operation locally.
2. Update UI immediately.
3. Queue operation for synchronization.
4. Synchronize when network becomes available.

This allows the application to function completely offline.

---

# Multi Device Synchronization

The assignment requires two devices operating on the same account.

To simulate this:

* Device A uses its own storage namespace.
* Device B uses its own storage namespace.

Both devices create operations independently.

During synchronization:

* Operations are uploaded to the backend.
* Backend resolves conflicts.
* Backend computes final state.

Because all devices synchronize against the same backend state, they eventually converge.

---

# Conflict Resolution

## Task Update Conflicts

Example:

Device A:

```text
Task m1 → Done
```

Device B:

```text
Task m1 → In Progress
```

Each update contains a version number.

Resolution rule:

* Higher version wins.

Implementation:

```ts
if (op.version > current.version) {
  taskStates[op.taskId] = op;
}
```

This ensures deterministic conflict resolution.

---

# Idempotency

## Backend Idempotency

Every operation contains a unique operation ID.

Before processing:

```ts
const exists = operations.find(
  (o) => o.id === op.id
);
```

If the operation already exists:

```ts
continue;
```

This prevents:

* Duplicate rewards
* Duplicate streak updates
* Duplicate focus minutes
* Duplicate task updates

---

## n8n Idempotency

Successful focus sessions trigger automation.

To prevent duplicate notifications:

```ts
const notifiedSessions =
  new Set<string>();
```

Before triggering n8n:

```ts
if (!notifiedSessions.has(op.id))
```

Only new session IDs generate notifications.

This guarantees exactly-once notification delivery for successful focus sessions.

---

# Convergence

All devices eventually synchronize their operations with the backend.

Because conflict resolution is deterministic:

* Same inputs
* Same resolution logic
* Same final state

All devices converge to identical results.

---

# Automation Design

When a successful focus session is confirmed:

1. Backend processes session.
2. Rewards are applied.
3. Backend triggers n8n webhook.
4. n8n workflow executes.
5. Notification event is generated.

The automation layer is separated from business logic, making it easy to extend in the future.

---

# Tradeoff

A simple Version-Based Last Write Wins strategy was chosen instead of CRDTs.

Advantages:

* Easy to understand
* Easy to implement
* Deterministic

Disadvantages:

* Does not preserve all concurrent edits
* More advanced collaborative scenarios would benefit from CRDTs

For the scope of this assignment, Version-Based Conflict Resolution provides a good balance between correctness and implementation complexity.

---

# Future Improvements

* Full SQLite persistence
* Delta synchronization
* App background failure detection
* Three or more device support
* Real WhatsApp integration
* Sync recovery after network interruptions
* Property-based convergence testing
