import { db } from "./database";

export const initializeDatabase =
  () => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS operations (
          id TEXT PRIMARY KEY,
          type TEXT,
          data TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          sessionId TEXT PRIMARY KEY
        )
      `);

      console.log(
        "Database Initialized"
      );
    });
  };