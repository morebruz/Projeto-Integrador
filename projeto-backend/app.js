const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Fornecedor = require('./models/fornecedor');
const Produto = require('./models/produto');
const Associacao = require('./models/associacao');

// Importar rotas
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

// Inicializar o Express
const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000', // ou '*' para permitir qualquer origem (apenas desenvolvimento)
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware para parsear JSON
app.use(express.json());

// Configurar rotas
app.use('/fornecedores', fornecedorRoutes);
app.use('/produtos', produtoRoutes);

// Sincronizar banco de dados e iniciar servidor
const PORT = 3001;

sequelize.sync({ force: true }) // force: true apenas em desenvolvimento
  .then(() => {
    console.log('Banco de dados sincronizado!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco:', err);
  });