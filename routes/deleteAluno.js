const express = require('express');
const db = require('../database/postgres'); // Importe o módulo postgres.js

const router = express.Router();

// Rota para excluir um aluno por ID
router.delete('/aluno_delete/:aluno_id', async (req, res) => {
  const alunoId = req.params.aluno_id;
  console.log(`Recebida solicitação para excluir aluno com ID: ${alunoId}`);

  // Verifique se o aluno com o ID especificado existe
  const alunoQuery = {
    text: 'SELECT aluno_id FROM alunos WHERE aluno_id = $1',
    values: [alunoId],
  };

  try {
    const alunoResult = await db.query(alunoQuery);

    if (alunoResult.length === 0) {
      // O aluno com o ID especificado não foi encontrado
      const error_message = 'Aluno não encontrado';
      res.status(400).json({ error: error_message });
    } else {
      // O aluno existe, então proceda com a exclusão
      const deleteQuery = {
        text: 'DELETE FROM alunos WHERE aluno_id = $1',
        values: [alunoId],
      };

      console.log(`Tentativa de excluir aluno no banco de dados: ${JSON.stringify(deleteQuery)}`);

      const deleteResult = await db.query(deleteQuery);

      if (deleteResult) {
        console.log(`Aluno excluído com sucesso. ID: ${alunoId}`);
        res.json({ message: 'Aluno excluído com sucesso' });
      } else {
        const error_message = 'Falha ao excluir aluno';
        res.status(500).json({ error: error_message });
      }
    }
  } catch (error) {
    const error_message = `Erro durante a verificação do aluno: ${error}`;
    console.error(error_message);
    res.status(500).json({ error: error_message });
  }
});

module.exports = router;
