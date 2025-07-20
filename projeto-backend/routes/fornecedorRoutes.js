const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');

router.post('/fornecedores', fornecedorController.criar);
router.get('/fornecedores', fornecedorController.listar);
router.get('/fornecedores/:id', fornecedorController.buscarPorId);
router.put('/fornecedores/:id', fornecedorController.atualizar);
router.delete('/fornecedores/:id', fornecedorController.deletar);

module.exports = router;
