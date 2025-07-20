const express = require('express');
const http = require('http');
const db = require('./models'); 
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/produtos', produtoRoutes);

app.get('/', (req, res) => {
  res.send('Servidor está no ar!');
});

const server = http.createServer(app);

db.sequelize.sync().then(() => {
  console.log('Banco sincronizado!');

  server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
  });
});
