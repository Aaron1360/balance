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
    body('msi_term').optional().isInt({ min: 0 }), // allow optional and 0 for single payment
    body('card').isString().notEmpty(),
    body('amount').isFloat({ min: 0.01 }),
    body('category').optional().isString(),
    body('paid').optional().isBoolean()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { name, date, msi_term, card, amount, category = "Sin categoria", paid = false } = req.body;
    // If msi_term is not provided, treat as single payment
    if (typeof msi_term === 'undefined' || msi_term === null || msi_term === 0) {
      msi_term = null;
      paid = true;
    }
    db.run(
      `INSERT INTO purchases (name, date, msi_term, card, amount, category, paid) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, date, msi_term, card, amount, category, paid ? 1 : 0],
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
      .withMessage('payments_made must be an integer greater than or equal to 0'),
    body('paid').optional().isBoolean()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { payments_made, paid } = req.body;
    let query = `UPDATE purchases SET payments_made = ?`;
    let params = [payments_made];
    if (typeof paid !== 'undefined') {
      query += ', paid = ?';
      params.push(paid ? 1 : 0);
    }
    query += ' WHERE id = ?';
    params.push(id);
    db.run(
      query,
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

app.patch(
  '/purchases/:id',
  [
    body('name').optional().isString().notEmpty(),
    body('date').optional().isISO8601(),
    body('msi_term').optional().isInt({ min: 0 }), // allow optional and 0 for single payment
    body('card').optional().isString().notEmpty(),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('category').optional().isString(),
    body('paid').optional().isBoolean()
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
    // If msi_term is being updated to undefined, null, or 0, treat as single payment
    if (fields.hasOwnProperty('msi_term') && (fields.msi_term === undefined || fields.msi_term === null || fields.msi_term === 0)) {
      fields.msi_term = null;
      fields.paid = true;
    }
    Object.entries(fields).forEach(([key, value]) => {
      if (key === 'paid') {
        updates.push(`${key} = ?`);
        params.push(value ? 1 : 0);
      } else {
        updates.push(`${key} = ?`);
        params.push(value);
      }
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
            const payments_left = row.msi_term > 0 ? row.msi_term - row.payments_made : 0;
            const monthly_payment = row.msi_term > 0 ? row.amount / row.msi_term : 0;
            const outstanding = payments_left > 0 ? payments_left * monthly_payment : 0;
            return { ...row, payments_left, monthly_payment, outstanding };
        });

        const total_outstanding = debtDetails.reduce((sum, p) => sum + p.outstanding, 0);

        // Calculate total monthly payment for MSI and single-payment purchases
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JS months are 0-based
        const currentYear = now.getFullYear();
        const total_monthly_payment =
            // Sum monthly payments for MSI purchases with payments left
            debtDetails.filter(p => p.msi_term > 0 && p.payments_left > 0)
                .reduce((sum, p) => sum + p.monthly_payment, 0)
            // Add total value of single-payment purchases made in the current month
            + debtDetails.filter(p => (p.msi_term === 0 || p.msi_term === null) && (() => {
                const d = new Date(p.date + 'T00:00:00');
                return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
            })())
                .reduce((sum, p) => sum + p.amount, 0);

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

// Profile endpoints
app.get('/profile', (req, res, next) => {
  db.get('SELECT * FROM profile WHERE id = 1', [], (err, row) => {
    if (err) return next({ status: 500, message: err.message });
    res.json(row);
  });
});

app.put('/profile', (req, res, next) => {
  const { name, currency, budget } = req.body;
  db.run(
    'UPDATE profile SET name = ?, currency = ?, budget = ? WHERE id = 1',
    [name || '', currency || 'MXN', budget || 0],
    function (err) {
      if (err) return next({ status: 500, message: err.message });
      res.json({ success: true });
    }
  );
});

// Cards endpoints
app.get('/cards', (req, res, next) => {
  db.all('SELECT * FROM cards', [], (err, rows) => {
    if (err) return next({ status: 500, message: err.message });
    res.json(rows);
  });
});

app.post('/cards', (req, res, next) => {
  const { brand, payment_date } = req.body;
  if (!brand || !payment_date) {
    return res.status(400).json({ error: 'brand and payment_date are required' });
  }
  db.run(
    'INSERT INTO cards (brand, payment_date) VALUES (?, ?)',
    [brand, payment_date],
    function (err) {
      if (err) return next({ status: 500, message: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/cards/:id', (req, res, next) => {
  const { id } = req.params;
  db.run('DELETE FROM cards WHERE id = ?', [id], function (err) {
    if (err) return next({ status: 500, message: err.message });
    res.json({ success: true, deleted: this.changes });
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

