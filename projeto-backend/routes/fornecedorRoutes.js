const express = require('express');
const router = express.Router();
const { Fornecedor } = require('../models');
const { Op } = require('sequelize');

// Validação de CNPJ (simplificada)
const validarCNPJ = (cnpj) => {
  return /^\d{14}$/.test(cnpj.replace(/\D/g, ''));
};

// POST - Cadastrar novo fornecedor
router.post('/', async (req, res) => {
  try {
    const { nome, cnpj, telefone, email } = req.body;

    // Validações
    if (!nome || !cnpj) {
      return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios' });
    }

    if (!validarCNPJ(cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    // Formata CNPJ 
    const cnpjFormatado = cnpj.replace(/\D/g, '');

    const fornecedor = await Fornecedor.create({
      nome,
      cnpj: cnpjFormatado,
      telefone,
      email
    });

    res.status(201).json({
      mensagem: 'Fornecedor cadastrado com sucesso!',
      dados: fornecedor
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ erro: 'CNPJ já cadastrado no sistema' });
    } else {
      console.error('Erro ao cadastrar fornecedor:', error);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  }
});

// Listar todos os fornecedores 
router.get('/', async (req, res) => {
  try {
    const { busca } = req.query;
    
    const where = {};
    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${busca}%` } },
        { cnpj: { [Op.like]: `%${busca}%` } }
      ];
    }

    const fornecedores = await Fornecedor.findAll({ 
      where,
      order: [['nome', 'ASC']] 
    });

    res.json(fornecedores);

  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ erro: 'Erro ao listar fornecedores' });
  }
});

//  Buscar fornecedor 
router.get('/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    
    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    res.json(fornecedor);

  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao buscar fornecedor' });
  }
});

//  Atualizar fornecedor
router.put('/:id', async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    
    const [updated] = await Fornecedor.update(
      { nome, telefone, email },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    res.json({ mensagem: 'Fornecedor atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao atualizar fornecedor' });
  }
});

// Remover fornecedor
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Fornecedor.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    res.json({ mensagem: 'Fornecedor removido com sucesso' });

  } catch (error) {
    console.error('Erro ao remover fornecedor:', error);
    res.status(500).json({ erro: 'Não foi possível remover o fornecedor' });
  }
});

module.exports = router;