const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js
const router = express.Router();

router.post('/user_create', async (req, res) => {
  const user = req.body;
  console.log(`Recebida solicitação para criar usuário: ${JSON.stringify(user)}`);

  // Gere um ID automaticamente (pode usar alguma lógica para isso)
  // Implemente a função generateUserId

  // Construa a consulta de inserção
  const insertQuery = {
    text:
      'INSERT INTO users (nome, cpf, telefone, email, idade, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id',
    values: [user.nome, user.cpf, user.telefone, user.email, user.idade, user.senha],
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
});

module.exports = router;
