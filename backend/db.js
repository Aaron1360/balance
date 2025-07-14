const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("balance.db");

// Drop the purchases table if it exists and create a new one with the category column
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      msi_term INTEGER DEFAULT 1,
      card TEXT NOT NULL,
      amount REAL NOT NULL,
      payments_made INTEGER DEFAULT 0,
      category TEXT DEFAULT '',
      paid INTEGER DEFAULT 0 -- 0: not paid, 1: paid
    )
  `);
  // Trigger: always set paid=1 for single-payment purchases (msi_term=0 or msi_term=1)
  db.run(`CREATE TRIGGER IF NOT EXISTS set_paid_single_payment_insert
    AFTER INSERT ON purchases
    FOR EACH ROW
    WHEN NEW.msi_term = 0 OR NEW.msi_term = 1
    BEGIN
      UPDATE purchases SET paid = 1 WHERE id = NEW.id;
    END;
  `);
  db.run(`CREATE TRIGGER IF NOT EXISTS set_paid_single_payment_update
    AFTER UPDATE OF msi_term ON purchases
    FOR EACH ROW
    WHEN NEW.msi_term = 0 OR NEW.msi_term = 1
    BEGIN
      UPDATE purchases SET paid = 1 WHERE id = NEW.id;
    END;
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT DEFAULT '',
      currency TEXT DEFAULT 'MXN',
      budget REAL DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      payment_date INTEGER NOT NULL
    )
  `);
  // Insert default profile if not exists
  db.run(`INSERT OR IGNORE INTO profile (id, name, currency, budget) VALUES (1, '', 'MXN', 0)`);
});

module.exports = db;
