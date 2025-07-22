const Produto = require('../models/produto');

exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      attributes: ['id', 'nome', 'estoque', 'codigoBarras', 'categoria'],
      order: [['nome', 'ASC']]
    });
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

exports.criarProduto = async (req, res) => { /*...*/ };
exports.atualizarProduto = async (req, res) => { /*...*/ };