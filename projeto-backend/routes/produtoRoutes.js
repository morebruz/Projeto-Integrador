const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Exemplo de rota GET para listar produtos
router.get('/', produtoController.listarProdutos);

// Exemplo de rota POST para criar produto
router.post('/', produtoController.criarProduto);

module.exports = router;