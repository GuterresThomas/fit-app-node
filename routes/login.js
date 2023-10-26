// login.js
const express = require('express');
const db = require('../database/postgres'); // Importa o módulo postgres.js

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await db.query('SELECT user_id, nome FROM users WHERE email = $1 AND senha = $2', [email, senha]);

    if (result.length > 0) {
      const { user_id, nome } = result[0];
      res.json({ user_id, nome });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro durante o login' });
  }
});

module.exports = router;
