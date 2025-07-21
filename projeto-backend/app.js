const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const fornecedorRoutes = require('./routes/fornecedorRoutes');

const app = express();
app.use(cors());
app.use(express.json());


sequelize.sync()
  .then(() => console.log('Banco de dados conectado!'))
  .catch(err => console.error('Erro ao conectar:', err));


app.use('/fornecedores', fornecedorRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
