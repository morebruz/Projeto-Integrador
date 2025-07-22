const express = require('express');
const router = express.Router();
const { Produto, Fornecedor } = require('../models');
const { Op } = require('sequelize');
const produtoController = require('../controllers/produtoController');

// POST - Cadastrar novo produto
router.post('/', async (req, res) => {
  try {
    const { nome, codigoBarras, descricao, categoria, quantidade } = req.body;

    // Validações básicas
    if (!nome || !categoria) {
      return res.status(400).json({ 
        success: false,
        message: 'Nome e categoria são obrigatórios',
        data: null
      });
    }

    const produto = await Produto.create({
      nome,
      codigoBarras,
      descricao,
      categoria,
      quantidade: quantidade || 0
    });

    res.status(201).json({
      success: true,
      message: 'Produto cadastrado com sucesso!',
      data: produto
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({
        success: false,
        message: 'Código de barras já cadastrado',
        data: null
      });
    } else {
      console.error('Erro ao cadastrar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor',
        data: null
      });
    }
  }
});

// GET - Listar todos os produtos (com filtros)
router.get('/', produtoController.listarProdutos);
router.post('/', produtoController.criarProduto);
router.get('/', async (req, res) => {
  try {
    const { categoria, busca, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    
    const where = {};
    if (categoria) where.categoria = categoria;
    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${busca}%` } },
        { descricao: { [Op.like]: `%${busca}%` } },
        { codigoBarras: { [Op.like]: `%${busca}%` } }
      ];
    }

    const { count, rows } = await Produto.findAndCountAll({
      where,
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['nome', 'ASC']],
      include: [{
        model: Fornecedor,
        through: { attributes: [] } // Oculta dados da tabela de associação
      }]
    });

    res.json({
      success: true,
      message: 'Produtos listados com sucesso',
      data: rows,
      paginacao: {
        pagina: parseInt(pagina),
        itensPorPagina: parseInt(limite),
        totalItens: count,
        totalPaginas: Math.ceil(count / limite)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar produtos',
      data: null
    });
  }
});

// GET - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [Fornecedor] // Traz os fornecedores associados
    });
    
    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Produto encontrado',
      data: produto
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto',
      data: null
    });
  }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao, categoria, quantidade } = req.body;
    
    const [updated] = await Produto.update(
      { nome, descricao, categoria, quantidade },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
        data: null
      });
    }

    // Retorna o produto atualizado
    const produtoAtualizado = await Produto.findByPk(req.params.id);
    
    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: produtoAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
      data: null
    });
  }
});

// DELETE - Remover produto
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Produto.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Produto removido com sucesso',
      data: null
    });

  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({
      success: false,
      message: 'Não foi possível remover o produto',
      data: null
    });
  }
});

module.exports = router;