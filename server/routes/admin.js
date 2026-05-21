const express = require('express');
const { users, messages } = require('../db');

const router = express.Router();

// Simple admin key check
const adminAuth = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

// GET all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const all = await users.find({}).sort({ created_at: -1 });
    res.json(all.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      verified: u.verified,
      created_at: u.created_at,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user by id
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await users.remove({ _id: req.params.id }, {});
    await messages.remove({ userId: req.params.id }, { multi: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all users
router.delete('/users', adminAuth, async (req, res) => {
  try {
    const count = await users.remove({}, { multi: true });
    await messages.remove({}, { multi: true });
    res.json({ ok: true, deleted: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
