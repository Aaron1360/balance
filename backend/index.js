const express = require('express');
const app = express();
const port = 3001;
const db = require('./db');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
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
    body('amount').isFloat({ min: 0.01 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, date, msi_term, card, amount } = req.body;
    db.run(
      `INSERT INTO purchases (name, date, msi_term, card, amount) VALUES (?, ?, ?, ?, ?)`,
      [name, date, msi_term, card, amount],
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
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Filtering parameters (example: by card or date)
  const { card, from, to } = req.query;
  let where = [];
  let params = [];

  if (card) {
    where.push('card = ?');
    params.push(card);
  }
  if (from) {
    where.push('date >= ?');
    params.push(from);
  }
  if (to) {
    where.push('date <= ?');
    params.push(to);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Count total for pagination
  db.get(`SELECT COUNT(*) as count FROM purchases ${whereClause}`, params, (err, countRow) => {
    if (err) {
      return next({ status: 500, message: err.message });
    }

    // Get paginated results
    db.all(
      `SELECT * FROM purchases ${whereClause} ORDER BY date DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
      (err, rows) => {
        if (err) {
          return next({ status: 500, message: err.message });
        }
        res.json({
          page,
          limit,
          total: countRow.count,
          purchases: rows
        });
      }
    );
  });
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

        res.json({
            total_outstanding,
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
      // Per card
      if (!perCard[row.card]) {
        perCard[row.card] = { spent: 0, outstanding: 0 };
      }
      perCard[row.card].spent += row.amount;
      const payments_left = row.msi_term - row.payments_made;
      const monthly_payment = row.amount / row.msi_term;
      perCard[row.card].outstanding += payments_left > 0 ? payments_left * monthly_payment : 0;

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
  db.get('SELECT COUNT(*) as count FROM purchases', (err, row) => {
    if (err) return next({ status: 500, message: err.message });
    res.json({ count: row.count });
  });
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

