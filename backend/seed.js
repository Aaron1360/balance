const db = require('./db');
const fs = require('fs');

const purchases = JSON.parse(fs.readFileSync('new_seed.json', 'utf8'));

db.serialize(() => {
  purchases.forEach(p => {
    db.run(
      `INSERT INTO purchases (name, date, msi_term, card, amount, payments_made, category, paid)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.name,
        p.date,
        p.msi_term || 0,
        p.card,
        p.amount,
        p.payments_made || 0,
        p.category || "Sin categoria",
        p.paid ? 1 : 0
      ]
    );
  });
  console.log('Seeding complete!');
});