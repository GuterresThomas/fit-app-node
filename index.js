const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/postgres'); // Importa o módulo postgres.js
const loginRouter = require('./routes/login'); // Importa o módulo login.js
const alunosPersonalRouter = require('./routes/alunosPersonal');
const addAlunoRouter = require('./routes/addAluno'); // Importe o módulo addAluno.js
const addTreinoRouter = require('./routes/addTreino');
const getAlunosTreinosRouter = require('./routes/getAlunosTreinos');
const deleteAlunoRouter = require('./routes/deleteAluno');
const frequenciaRouter = require('./routes/frequencia')


const app = express();
app.use(bodyParser.json());

// Middleware de CORS (permite todas as origens, você pode configurá-lo de acordo com suas necessidades)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// rotas
app.use('/', loginRouter);
app.use('/', alunosPersonalRouter);
app.use('/', addAlunoRouter);
app.use('/', addTreinoRouter);
app.use('/', getAlunosTreinosRouter);
app.use('/', deleteAlunoRouter);
app.use('/', frequenciaRouter);

// Defina outras rotas semelhantes para criar usuário, treino, aluno, etc.

app.listen(3030, () => {
  console.log('Servidor iniciado na porta 3030');
});
