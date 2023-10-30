// login.js
const express = require('express');
const db = require('../database/postgres'); // Importa o módulo postgres.js
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  console.log('senha vindo do body', senha);
  try {
    const result = await db.query('SELECT user_id, nome, senha AS senhahash FROM users WHERE email = $1', [email]);
    console.log('coluna que está o possível erro', result);

    if (result && result.length > 0) {
      const { user_id, nome, senhahash } = result[0];
      console.log('senhahash: ', senhahash);
      
      
      const passwordMatch = bcrypt.compareSync(senha.trim(), senhahash.trim());

      console.log('senha do body:', senha);
      console.log('senhahash do banco de dados:', senhahash);
      console.log('A comparação entre a senha e o hash retornou:', passwordMatch);

      if (passwordMatch) {
        res.json({ user_id, nome });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro durante o login' });
  }
});

module.exports = router;
