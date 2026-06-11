import sqlite3 from "sqlite3";

export const db = new sqlite3.Database(
  "./alcovia.db",
  (err) => {
    if (err) {
      console.log(
        "SQLite Error:",
        err.message
      );
    } else {
      console.log(
        "SQLite Connected"
      );
    }
  }
);