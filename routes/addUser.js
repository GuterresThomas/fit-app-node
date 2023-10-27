const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/user_create', async (req, res) => {
  const user = req.body;
  console.log(`Recebida solicitação para criar usuário: ${JSON.stringify(user)}`);


  // Gere o hash seguro da senha
  const saltRounds = 7; // Você pode ajustar o número de rounds de hashing

  bcrypt.hash(user.senha, saltRounds, async (err, hash) => {
    if (err) {
      // Lida com erros
      res.status(500).json({ error: 'Falha ao criar hash de senha' });
    } else {
      // Use o hash seguro ao invés da senha original para a inserção no banco de dados
      const insertQuery = {
        text:
          'INSERT INTO users (nome, cpf, telefone, email, idade, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id',
        values: [user.nome, user.cpf, user.telefone, user.email, user.idade, hash],
      };

      console.log(`Tentativa de inserir usuário no banco de dados: ${JSON.stringify(insertQuery)}`);

      try {
        const insertResult = await db.query(insertQuery);
        if (insertResult.length === 1) {
          // Usuário adicionado com sucesso
          user.user_id = insertResult[0].user_id;
          console.log(`Usuário criado com sucesso: ${JSON.stringify(user)}`);
          res.json(user);
        } else {
          const error_message = 'Falha ao adicionar usuário';
          res.status(500).json({ error: error_message });
        }
      } catch (error) {
        const error_message = `Erro durante a inserção do usuário: ${error}`;
        console.error(error_message);
        res.status(500).json({ error: error_message });
      }
    }
  });
});

module.exports = router;