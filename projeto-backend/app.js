const express = require('express');
const cors = require('cors');
const sequelize = require('./database/config');

// Importar modelos
require('./models/fornecedor');
require('./models/produto');
require('./models/associacao');

// Importar rotas
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const associacaoRoutes = require('./routes/associacaoRoutes');
// Configuração do Express
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuração do body-parser com limite aumentado
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString());
      req.rawBody = buf.toString();
    } catch (e) {
      console.error('JSON inválido recebido:', buf.toString());
      throw new Error('JSON inválido');
    }
  }
}));


// Middleware de log
app.use((req, res, next) => {
  console.log('\n=== NOVA REQUISIÇÃO ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.rawBody || req.body);
  next();
});

// Rotas
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/associacoes', associacaoRoutes);
// Rota de teste
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API de Controle de Estoque funcionando',
    endpoints: {
      fornecedores: '/api/fornecedores',
      produtos: '/api/produtos'
    }
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false }) // Alterar para true apenas em desenvolvimento
  .then(() => {
    console.log('✅ Banco de dados sincronizado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Documentação disponível em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao sincronizar banco:', err);
    process.exit(1);
  });

module.exports = app;