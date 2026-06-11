import express from "express";
import cors from "cors";
import axios from "axios";

import { initializeDatabase } from "./db/schema";

const app = express();

initializeDatabase();

app.use(cors());
app.use(express.json());

// =========================
// In-Memory Database
// =========================

let operations: any[] = [];

let userState = {
  coins: 0,
  streak: 0,
  todayFocusMinutes: 0,
};

let taskStates: Record<string, any> = {};

const notifiedSessions = new Set<string>();

// =========================
// Routes
// =========================

app.get("/", (req, res) => {
  res.send("Alcovia Backend Running");
});

// =========================
// Current State
// =========================

app.get("/state", (req, res) => {
  res.json({
    userState,
    taskStates,
    operationsCount: operations.length,
  });
});

// =========================
// All Operations
// =========================

app.get("/operations", (req, res) => {
  res.json({
    count: operations.length,
    operations,
  });
});

// =========================
// Resolved Tasks
// =========================

app.get("/tasks", (req, res) => {
  res.json(taskStates);
});

// =========================
// Sync Endpoint
// =========================

app.post("/sync", async (req, res) => {
  const incoming = req.body.operations || [];

  console.log(
    "INCOMING OPERATIONS:",
    incoming.length
  );

  for (const op of incoming) {
    const exists = operations.find(
      (o) => o.id === op.id
    );

    if (exists) {
      continue;
    }

    operations.push(op);

    // =========================
    // Focus Sessions
    // =========================

    if (
      op.type === "focus_session" &&
      op.status === "success"
    ) {
      console.log(
        "SUCCESS SESSION:",
        op.id
      );

      userState.coins += 50;
      userState.streak += 1;
      userState.todayFocusMinutes += 25;

      if (!notifiedSessions.has(op.id)) {
        notifiedSessions.add(op.id);

        try {
          await axios.post(
            "http://localhost:5678/webhook/focus-success",
            {
              sessionId: op.id,
              streak: userState.streak,
              coins: userState.coins,
              focusMinutes:
                userState.todayFocusMinutes,
            }
          );

          console.log(
            "N8N NOTIFICATION SENT:",
            op.id
          );
        } catch (error) {
          console.log(
            "N8N WEBHOOK FAILED"
          );
        }
      }
    }

    // =========================
    // Task Conflict Resolution
    // =========================

    if (op.type === "task_update") {
      const current =
        taskStates[op.taskId];

      if (!current) {
        taskStates[op.taskId] = op;
      } else if (
        op.version >
        current.version
      ) {
        taskStates[op.taskId] = op;
      }
    }
  }

  res.json({
    success: true,
    userState,
    taskStates,
    operationsCount:
      operations.length,
  });
});

// =========================
// Start Server
// =========================

app.listen(3001, () => {
  console.log(
    "🚀 Server running on port 3001"
  );
});