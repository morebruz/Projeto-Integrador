const express = require('express');
const router = express.Router();
const db = require('../models');

const Produto = db.Produto;
const Fornecedor = db.Fornecedor;
const Associacao = db.Associacao;

// Criar associação
router.post('/produto-fornecedor', async (req, res) => {
  try {
    const { produtoId, fornecedorId } = req.body;
    const produto = await Produto.findByPk(produtoId);
    const fornecedor = await Fornecedor.findByPk(fornecedorId);

    if (!produto || !fornecedor) {
      return res.status(404).json({ error: 'Produto ou Fornecedor não encontrado' });
    }

    await produto.addFornecedor(fornecedor);

    res.json({ message: 'Associação criada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar associações (exemplo: produtos com seus fornecedores)
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [{
        model: Fornecedor,
        through: { attributes: [] } // não traz atributos da tabela associativa
      }]
    });

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remover associação
router.delete('/produto-fornecedor', async (req, res) => {
  try {
    const { produtoId, fornecedorId } = req.body;
    const produto = await Produto.findByPk(produtoId);
    const fornecedor = await Fornecedor.findByPk(fornecedorId);

    if (!produto || !fornecedor) {
      return res.status(404).json({ error: 'Produto ou Fornecedor não encontrado' });
    }

    await produto.removeFornecedor(fornecedor);

    res.json({ message: 'Associação removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;