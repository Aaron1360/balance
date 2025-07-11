const express = require('express');
const app = express();
const port = 3001;
const db = require('./db');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.1.117:5173'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post(
  '/purchases',
  [
    body('name').isString().notEmpty(),
    body('date').isISO8601(),
    body('msi_term').isInt({ min: 1 }),
    body('card').isString().notEmpty(),
    body('amount').isFloat({ min: 0.01 }),
    body('category').optional().isString()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, date, msi_term, card, amount, category = "Sin categoria" } = req.body;
    db.run(
      `INSERT INTO purchases (name, date, msi_term, card, amount, category) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, date, msi_term, card, amount, category],
      function (err) {
        if (err) {
          return next({ status: 500, message: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  }
);

app.get('/purchases', (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { start, end, category, state } = req.query;
  const params = [];
  let whereClause = "";

  if (start) {
    whereClause += (whereClause ? " AND " : " WHERE ") + "date >= ?";
    params.push(start);
  }
  if (end) {
    whereClause += (whereClause ? " AND " : " WHERE ") + "date <= ?";
    params.push(end);
  }
  if (category) {
    whereClause += (whereClause ? " AND " : " WHERE ") + "LOWER(category) = LOWER(?)";
    params.push(category);
  }
  if (state === "paid") {
    whereClause += (whereClause ? " AND " : " WHERE ") + "payments_made = msi_term";
  } else if (state === "unpaid") {
    whereClause += (whereClause ? " AND " : " WHERE ") + "payments_made < msi_term";
  }

  db.all(
    `SELECT * FROM purchases ${whereClause} ORDER BY date DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
    (err, rows) => {
      if (err) return next({ status: 500, message: err.message });
      res.json({ purchases: rows });
    }
  );
});

app.patch(
  '/purchases/:id/payments',
  [
    body('payments_made')
      .isInt({ min: 0 })
      .withMessage('payments_made must be an integer greater than or equal to 0')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { payments_made } = req.body;
    db.run(
      `UPDATE purchases SET payments_made = ? WHERE id = ?`,
      [payments_made, id],
      function (err) {
        if (err) {
          return next({ status: 500, message: err.message });
        }
        if (this.changes === 0) {
          return next({ status: 404, message: 'Purchase not found' });
        }
        res.json({ success: true });
      }
    );
  }
);

app.patch(
  '/purchases/:id',
  [
    body('name').optional().isString().notEmpty(),
    body('date').optional().isISO8601(),
    body('msi_term').optional().isInt({ min: 1 }),
    body('card').optional().isString().notEmpty(),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('category').optional().isString()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const fields = req.body;
    const updates = [];
    const params = [];
    Object.entries(fields).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      params.push(value);
    });
    params.push(id);
    db.run(
      `UPDATE purchases SET ${updates.join(", ")} WHERE id = ?`,
      params,
      function (err) {
        if (err) {
          return next({ status: 500, message: err.message });
        }
        if (this.changes === 0) {
          return next({ status: 404, message: 'Purchase not found' });
        }
        res.json({ success: true });
      }
    );
  }
);

app.get('/debt-overview', (req, res, next) => {
    db.all('SELECT * FROM purchases', [], (err, rows) => {
        if (err) {
            return next({ status: 500, message: err.message });
        }
        // Calculate total debt and payments made
        const debtDetails = rows.map(row => {
            const payments_left = row.msi_term - row.payments_made;
            const monthly_payment = row.amount / row.msi_term;
            const outstanding = payments_left > 0 ? payments_left * monthly_payment : 0;
            return { ...row, payments_left, monthly_payment, outstanding };
        });

        const total_outstanding = debtDetails.reduce((sum, p) => sum + p.outstanding, 0);

        // Calculate total monthly payment for unpaid purchases
        const total_monthly_payment = debtDetails
            .filter(p => p.payments_left > 0)
            .reduce((sum, p) => sum + p.monthly_payment, 0);

        res.json({
            total_outstanding,
            total_monthly_payment,
            purchases: debtDetails
        });
    });
});

app.get('/purchases/completed', (req, res, next) => {
    db.all('SELECT * FROM purchases WHERE payments_made >= msi_term',
        [],
        (err, rows) => {
            if (err) {
                return next({ status: 500, message: err.message });
            }
            res.json(rows);
        }
    );
});

app.get('/summary', (req, res, next) => {
  db.all('SELECT * FROM purchases', [], (err, rows) => {
    if (err) {
      return next({ status: 500, message: err.message });
    }

    const perCard = {};
    const perMsi = {};

    rows.forEach(row => {
      // Per card (case-insensitive)
      const cardKey = row.card ? row.card.toLowerCase() : "";
      if (!perCard[cardKey]) {
        perCard[cardKey] = { spent: 0, outstanding: 0 };
      }
      perCard[cardKey].spent += row.amount;
      const payments_left = row.msi_term - row.payments_made;
      const monthly_payment = row.amount / row.msi_term;
      perCard[cardKey].outstanding += payments_left > 0 ? payments_left * monthly_payment : 0;

      // Per MSI term
      if (!perMsi[row.msi_term]) {
        perMsi[row.msi_term] = { spent: 0, outstanding: 0 };
      }
      perMsi[row.msi_term].spent += row.amount;
      perMsi[row.msi_term].outstanding += payments_left > 0 ? payments_left * monthly_payment : 0;
    });

    res.json({
      perCard,
      perMsi
    });
  });
});

app.post('/purchases/:id/payoff', (req, res, next) => {
  const { id } = req.params;
  db.get('SELECT msi_term FROM purchases WHERE id = ?', [id], (err, row) => {
    if (err) {
      return next({ status: 500, message: err.message });
    }
    if (!row) {
      return next({ status: 404, message: 'Purchase not found' });
    }
    db.run(
      'UPDATE purchases SET payments_made = ? WHERE id = ?',
      [row.msi_term, id],
      function (err) {
        if (err) {
          return next({ status: 500, message: err.message });
        }
        res.json({ success: true, message: 'Purchase marked as fully paid.' });
      }
    );
  });
});

// DELETE purchases by id or before a certain date
app.delete('/purchases', (req, res, next) => {
  const { id, before } = req.query;

  if (!id && !before) {
    return res.status(400).json({ error: "Provide 'id' or 'before' query parameter." });
  }

  if (id) {
    db.run('DELETE FROM purchases WHERE id = ?', [id], function (err) {
      if (err) {
        return next({ status: 500, message: err.message });
      }
      return res.json({ success: true, deleted: this.changes });
    });
  } else if (before) {
    db.run('DELETE FROM purchases WHERE date < ?', [before], function (err) {
      if (err) {
        return next({ status: 500, message: err.message });
      }
      return res.json({ success: true, deleted: this.changes });
    });
  }
});

app.get('/purchases/count', (req, res, next) => {
  const { start, end, category, state } = req.query;
  const params = [];
  let whereClause = "";

  if (start) {
    whereClause += (whereClause ? " AND " : " WHERE ") + "date >= ?";
    params.push(start);
  }
  if (end) {
    whereClause += (whereClause ? " AND " : " WHERE ") + "date <= ?";
    params.push(end);
  }
  if (category) {
    whereClause += (whereClause ? " AND " : " WHERE ") + "LOWER(category) = LOWER(?)";
    params.push(category);
  }
  if (state === "paid") {
    whereClause += (whereClause ? " AND " : " WHERE ") + "payments_made = msi_term";
  } else if (state === "unpaid") {
    whereClause += (whereClause ? " AND " : " WHERE ") + "payments_made < msi_term";
  }

  db.get(
    `SELECT COUNT(*) as count FROM purchases ${whereClause}`,
    params,
    (err, row) => {
      if (err) return next({ status: 500, message: err.message });
      res.json({ count: row.count });
    }
  );
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      details: err.details || null
    }
  });
});

