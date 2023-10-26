// getAlunosTreinos.js
const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js

const router = express.Router();

router.get('/alunos_treinos', async (req, res) => {
  const query = {
    text: `
      SELECT
        alunos.aluno_id,
        alunos.personal_id,
        alunos.nome AS nome_aluno,
        alunos.email AS email_aluno,
        alunos.telefone AS telefone_aluno,
        alunos.cpf AS cpf_aluno,
        treinos.treino_id,
        treinos.data_do_treino,
        treinos.descricao_do_treino,
        users.nome AS nome_personal
      FROM
        alunos
      JOIN
        users ON alunos.personal_id = users.user_id
      JOIN
        treinos ON alunos.aluno_id = treinos.aluno_id
    `,
  };

  try {
    const result = await db.query(query);
    const alunosTreinos = [];

    for (const row of result) {
      const alunoTreino = {
        aluno_id: row.aluno_id,
        personal_id: row.personal_id,
        nome_aluno: row.nome_aluno,
        email_aluno: row.email_aluno,
        telefone_aluno: row.telefone_aluno,
        cpf_aluno: row.cpf_aluno,
        treino_id: row.treino_id,
        data_do_treino: row.data_do_treino,
        descricao_do_treino: row.descricao_do_treino,
        nome_personal: row.nome_personal,
      };

      alunosTreinos.push(alunoTreino);
    }

    res.json(alunosTreinos);
  } catch (error) {
    console.error(`Erro na consulta de alunos e treinos: ${error}`);
    res.status(500).json({ error: 'Erro na consulta de alunos e treinos' });
  }
});

module.exports = router;
