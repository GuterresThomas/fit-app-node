// addTreino.js
const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js

const router = express.Router();

router.post('/treino_create', async (req, res) => {
  const treino = req.body;

  // Verifique se o usuário com o ID especificado existe
  const aluno_id = treino.aluno_id;
  const userQuery = {
    text: 'SELECT aluno_id FROM alunos WHERE aluno_id = $1',
    values: [aluno_id],
  };

  try {
    const userResult = await db.query(userQuery);
    if (userResult.length === 0) {
      // O usuário com o ID especificado não foi encontrado
      const error_message = 'Usuário não encontrado';
      res.status(400).json({ error: error_message });
    } else {
      // O usuário existe, então insira o treino associado
      const insertQuery = {
        text:
          'INSERT INTO treinos (treino_id, aluno_id, data_do_treino, descricao_do_treino) VALUES ($1, $2, $3, $4)',
        values: [
          treino.treino_id,
          treino.aluno_id,
          treino.data_do_treino,
          treino.descricao_do_treino,
        ],
      };

      const insertResult = await db.query(insertQuery);
      if (insertResult) {
        res.json(treino);
      } else {
        const error_message = 'Falha ao adicionar treino';
        res.status(500).json({ error: error_message });
      }
    }
  } catch (error) {
    const error_message = `Erro durante a verificação do usuário: ${error}`;
    console.error(error_message);
    res.status(500).json({ error: error_message });
  }
});

module.exports = router;
