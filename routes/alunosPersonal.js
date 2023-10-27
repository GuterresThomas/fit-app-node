const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js

const router = express.Router();

router.get('/alunos/personal/:personal_id', async (req, res) => {
  const personalId = req.params.personal_id;
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
      LEFT JOIN
        treinos ON alunos.aluno_id = treinos.aluno_id
      WHERE
        alunos.personal_id = $1
    `,
    values: [personalId],
  };

  try {
    const result = await db.query(query);
    const alunosTreinosMap = new Map(); // Usaremos um mapa para agrupar os treinos sob cada aluno

    for (const row of result) {
      const alunoTreino = {
        aluno_id: row.aluno_id,
        personal_id: row.personal_id,
        nome_aluno: row.nome_aluno,
        email_aluno: row.email_aluno,
        telefone_aluno: row.telefone_aluno,
        cpf_aluno: row.cpf_aluno,
        nome_personal: row.nome_personal,
      };

      if (!alunosTreinosMap.has(row.aluno_id)) {
        alunosTreinosMap.set(row.aluno_id, { ...alunoTreino, treinos: [] });
      }

      if (row.treino_id) {
        alunosTreinosMap.get(row.aluno_id).treinos.push({
          treino_id: row.treino_id,
          data_do_treino: row.data_do_treino,
          descricao_do_treino: row.descricao_do_treino,
        });
      }
    }

    const alunosTreinos = Array.from(alunosTreinosMap.values());

    res.json(alunosTreinos);
  } catch (error) {
    console.error(`Erro na consulta de alunos e treinos: ${error}`);
    res.status(500).json({ error: 'Erro na consulta de alunos e treinos' });
  }
});

module.exports = router;
