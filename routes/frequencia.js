const express = require('express');
const db = require('../database/postgres'); // Importe o módulo PostgreSQL que você configurou

const router = express.Router();

// Rota para registrar a frequência do aluno
router.post('/registrar_frequencia', async (req, res) => {
  const { aluno_id, data_frequencia, presente } = req.body;

  try {
    // Insira o registro de frequência no banco de dados
    const insertQuery = {
      text: 'INSERT INTO frequencia (aluno_id, data_frequencia, presente) VALUES ($1, $2, $3)',
      values: [aluno_id, data_frequencia, presente],
    };

    const result = await db.query(insertQuery);

    if (result) {
      res.status(200).json({ message: 'Frequência registrada com sucesso' });
    } else {
      res.status(500).json({ error: 'Falha ao registrar a frequência' });
    }
  } catch (error) {
    console.error('Erro ao registrar frequência:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para consultar a frequência de um aluno em um período específico
router.get('/consultar_frequencia/:aluno_id', async (req, res) => {
    const { aluno_id } = req.params;
    const { data_inicio, data_fim } = req.query;

    

    try {
        // Verifique se os parâmetros de consulta estão presentes
        if (!data_inicio || !data_fim) {
            return res.status(400).json({ error: 'Parâmetros de consulta ausentes' });
        }

        console.log("Parâmetros da consulta - aluno_id:", aluno_id);
        console.log("Parâmetros da consulta - data_inicio:", data_inicio);
        console.log("Parâmetros da consulta - data_fim:", data_fim);

        // Certifique-se de que as datas estejam no formato 'YYYY-MM-DD'
        const data_inicio_formatada = new Date(data_inicio).toISOString().split('T')[0];
        const data_fim_formatada = new Date(data_fim).toISOString().split('T')[0];
        
        // Agora você pode usá-las na consulta SQL
        const selectQuery = {
            text: 'SELECT * FROM frequencia WHERE aluno_id = $1 AND data_frequencia BETWEEN $2 AND $3',
            values: [aluno_id, data_inicio_formatada, data_fim_formatada],
        };
        

        console.log("Query SQL executada:", selectQuery.text);
        console.log("Valores da query:", selectQuery.values);

        const result = await db.query(selectQuery);
        console.log("Dados da frequência:", result);

        console.log('result rows', result.rows);
        if (result) {
            res.status(200).json(result);
        } else {
            console.log("Nenhum registro de frequência encontrado.");
            res.status(200).json({ message: "Nenhum registro de frequência neste período." });
        }
        
    } catch (error) {
        console.error('Erro ao consultar frequência:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
