# Alcovia Offline-First Study Platform

## Overview

This project is an offline-first study platform built for the Alcovia Full Stack Engineering Intern Assignment.

The application allows students to:

* Complete Focus Sessions and earn rewards.
* Track Syllabus Progress across subjects and tasks.
* Continue using the app without internet.
* Synchronize changes across multiple devices.
* Trigger automations through n8n.

## Tech Stack

### Frontend

* React Native (Expo Web)
* TypeScript
* AsyncStorage

### Backend

* Express.js
* TypeScript

### Automation

* n8n

---

## Features

### Focus Sessions

Students can:

* Start a focus session.
* Complete a session successfully.
* Give up a session.

Successful sessions:

* Increase streak count.
* Award coins.
* Increase daily focus minutes.

All focus sessions work offline and synchronize later.

---

### Syllabus Progress

Students can:

* View subjects and tasks.
* Mark tasks as completed.
* Track chapter and subject progress.

Task updates work offline and synchronize when connectivity returns.

---

### Offline First Design

All user actions are stored locally before synchronization.

Examples:

* Focus session completion
* Focus session failure
* Task updates

Operations are stored locally and synchronized with the backend later.

---

## Multi Device Support

The application simulates multiple devices:

* Device A
* Device B

Each device maintains its own local storage.

Devices can:

* Work offline independently.
* Create changes independently.
* Synchronize later.

After synchronization, both devices converge to the same final state.

---

## Conflict Resolution

Task conflicts are resolved using version numbers.

When two devices modify the same task:

* The operation with the higher version wins.

This guarantees deterministic conflict resolution and convergence.

---

## Idempotency

### Backend Idempotency

Each operation contains a unique operation ID.

Duplicate operations are ignored.

This prevents:

* Duplicate rewards
* Duplicate streak increments
* Duplicate state changes

### n8n Idempotency

Successful focus sessions contain a unique session ID.

Notifications are sent exactly once per session.

Duplicate sync requests do not generate duplicate notifications.

---

## n8n Automation

When a focus session is successfully synchronized:

1. Backend confirms the session.
2. Backend triggers an n8n webhook.
3. n8n receives session data.
4. Notification workflow executes.

Example:

Streak now 4 days, +50 coins.

---

## Running the Project

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend URL:

```text
http://localhost:3001
```

### n8n

```bash
npx n8n
```

n8n URL:

```text
http://localhost:5678
```

Import:

```text
n8n-workflow.json
```

Activate the workflow.

---

## API Endpoints

### Current State

```http
GET /state
```

### Operation Log

```http
GET /operations
```

### Resolved Tasks

```http
GET /tasks
```

### Synchronization

```http
POST /sync
```

---

## Project Structure

```text
alcovia-assignment/
│
├── frontend/
│
├── backend/
│
├── README.md
│
├── DECISIONS.md
│
└── n8n-workflow.json
```

---

## Future Improvements

* SQLite persistence
* App background failure detection
* 3+ device synchronization
* Delta synchronization
* Real WhatsApp integration
* Sync recovery after network interruptions

---

## Author

B Varshith
