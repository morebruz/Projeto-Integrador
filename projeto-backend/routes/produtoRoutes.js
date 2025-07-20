const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

//  rota GET para listar produtos
router.get('/', produtoController.listarProdutos);

// rota POST para criar produto
router.post('/', produtoController.criarProduto);

module.exports = router;