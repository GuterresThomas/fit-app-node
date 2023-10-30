const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js

const router = express.Router();

router.post('/aluno_create', async (req, res) => {
  const aluno = req.body;
  console.log(`Recebida solicitação para criar aluno: ${JSON.stringify(aluno)}`);

  // Verifique se o usuário com o ID especificado existe
  const user_id = aluno.personal_id;
  const userQuery = {
    text: 'SELECT user_id FROM users WHERE user_id = $1',
    values: [user_id],
  };

  try {
    const userResult = await db.query(userQuery);
    if (userResult.length === 0) {
      // O personal trainer com o ID especificado não foi encontrado
      const error_message = 'Personal Trainer não encontrado';
      res.status(400).json({ error: error_message });
    } else {
      // O personal trainer existe, então insira o aluno associado
      const insertQuery = {
        text:
          'INSERT INTO alunos (aluno_id, personal_id, nome, email, telefone, cpf) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [
          aluno.aluno_id,
          aluno.personal_id,
          aluno.nome,
          aluno.email,
          aluno.telefone,
          aluno.cpf,
          aluno.observacoes_objetivos,
        ],
      };

      console.log(`Tentativa de inserir aluno no banco de dados: ${JSON.stringify(insertQuery)}`);

      const insertResult = await db.query(insertQuery);
      if (insertResult) {
        console.log(`Aluno criado com sucesso: ${JSON.stringify(aluno)}`);
        res.json(aluno);
      } else {
        const error_message = 'Falha ao adicionar aluno';
        res.status(500).json({ error: error_message });
      }
    }
  } catch (error) {
    const error_message = `Erro durante a verificação do personal trainer: ${error}`;
    console.error(error_message);
    res.status(500).json({ error: error_message });
  }
});

module.exports = router;
