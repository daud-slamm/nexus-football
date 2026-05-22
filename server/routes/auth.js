const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { users } = require('../db');
const { sendVerificationEmail } = require('../utils/mailer');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (password.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  try {
    const existing = await users.findOne({ email });
    if (existing) return res.status(409).json({ error: 'El usuario o email ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await users.insert({
      username,
      email,
      password: hashed,
      verified: false,
      verificationToken,
      verificationExpires,
      created_at: new Date().toISOString(),
    });

    // Fire and forget — don't block the response waiting for email
    sendVerificationEmail(email, username, verificationToken)
      .then(() => console.log('Verification email sent to', email))
      .catch(err => console.error('Error sending verification email:', err.message));

    res.status(201).json({ message: 'Cuenta creada. Revisa tu email para verificarla.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// VERIFY EMAIL
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await users.findOne({ verificationToken: token });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/verify?status=invalid`);
    }

    if (new Date(user.verificationExpires) < new Date()) {
      return res.redirect(`${process.env.CLIENT_URL}/verify?status=expired`);
    }

    await users.update(
      { _id: user._id },
      { $set: { verified: true, verificationToken: null, verificationExpires: null } }
    );

    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/verify?status=error`);
  }
});

// RESEND VERIFICATION
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No existe ninguna cuenta con ese email' });
    if (user.verified) return res.status(400).json({ error: 'Esta cuenta ya está verificada' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await users.update(
      { _id: user._id },
      { $set: { verificationToken, verificationExpires } }
    );

    await sendVerificationEmail(email, user.username, verificationToken);
    res.json({ message: 'Email de verificación reenviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reenviar el email' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  const user = await users.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Credenciales incorrectas' });

  if (!user.verified) {
    return res.status(403).json({
      error: 'Debes verificar tu email antes de entrar',
      notVerified: true,
      email: user.email,
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

module.exports = router;
