const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("balance.db");

// Drop the purchases table if it exists and create a new one with the category column
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      msi_term INTEGER NOT NULL,
      card TEXT NOT NULL,
      amount REAL NOT NULL,
      payments_made INTEGER DEFAULT 0,
      category TEXT DEFAULT ''
    )
  `);
});

module.exports = db;
