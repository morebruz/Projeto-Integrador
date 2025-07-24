const express = require('express');
const router = express.Router();
const { Fornecedor } = require('../models');
const { Op } = require('sequelize');

// Função de validação de CNPJ aprimorada
const validarCNPJ = (cnpj) => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos e não é uma sequência repetida
  if (cnpjLimpo.length !== 14 || /^(\d)\1+$/.test(cnpjLimpo)) {
    return false;
  }

  // Validação dos dígitos verificadores (opcional)
  // ... (pode implementar a validação completa se necessário)
  
  return true;
};

// Middleware para log de requisições
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// POST - Criar fornecedor
router.post('/', async (req, res) => {
  try {
    // Verificação do corpo da requisição
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ erro: 'Corpo da requisição vazio' });
    }

    const { 
      nomeEmpresa, 
      cnpj, 
      endereco, 
      telefone, 
      email, 
      contatoPrincipal 
    } = req.body;

    // Validação dos campos obrigatórios
    const camposObrigatorios = { 
      nomeEmpresa: nomeEmpresa?.trim(), 
      cnpj: cnpj?.trim(),
      endereco: endereco?.trim(),
      contatoPrincipal: contatoPrincipal?.trim()
    };

    const camposFaltantes = Object.entries(camposObrigatorios)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios faltando',
        campos: camposFaltantes,
        exemplo: {
          nomeEmpresa: "Nome da Empresa",
          cnpj: "00.000.000/0000-00",
          endereco: "Rua Exemplo, 123",
          contatoPrincipal: "Nome do Contato"
        }
      });
    }

    // Validação do CNPJ
    if (!validarCNPJ(cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    const cnpjFormatado = cnpj.replace(/\D/g, '');

    // Criação do fornecedor
    const fornecedor = await Fornecedor.create({
      nomeEmpresa: nomeEmpresa.trim(),
      cnpj: cnpjFormatado,
      endereco: endereco.trim(),
      telefone: telefone?.trim() || null,
      email: email?.trim() || null,
      contatoPrincipal: contatoPrincipal.trim()
    });

    res.status(201).json({
      mensagem: 'Fornecedor cadastrado com sucesso!',
      dados: fornecedor
    });

  } catch (error) {
    console.error('Erro ao cadastrar fornecedor:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ erro: 'CNPJ já cadastrado no sistema' });
    } else if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map(err => ({
        campo: err.path,
        mensagem: err.message,
        valor: err.value
      }));
      res.status(400).json({ 
        erro: 'Erro de validação nos dados',
        detalhes: erros
      });
    } else {
      res.status(500).json({ 
        erro: 'Erro interno no servidor',
        detalhe: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// GET - Listar todos os fornecedores (com busca e paginação)
router.get('/', async (req, res) => {
  try {
    const { busca, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    
    const where = {};
    if (busca) {
      where[Op.or] = [
        { nomeEmpresa: { [Op.iLike]: `%${busca}%` } },
        { cnpj: { [Op.like]: `%${busca.replace(/\D/g, '')}%` } },
        { contatoPrincipal: { [Op.iLike]: `%${busca}%` } }
      ];
    }

    const { count, rows } = await Fornecedor.findAndCountAll({
      where,
      order: [['nomeEmpresa', 'ASC']],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(count / limite),
      dados: rows
    });

  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ 
      erro: 'Erro ao listar fornecedores',
      detalhe: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Buscar fornecedor por ID
router.get('/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    
    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    res.json(fornecedor);

  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ 
      erro: 'Erro ao buscar fornecedor',
      detalhe: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT - Atualizar fornecedor
router.put('/:id', async (req, res) => {
  try {
    const { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;
    
    // Validação dos campos obrigatórios
    if (!nomeEmpresa || !cnpj || !endereco || !contatoPrincipal) {
      return res.status(400).json({ 
        erro: 'Todos os campos são obrigatórios',
        camposObrigatorios: ['nomeEmpresa', 'cnpj', 'endereco', 'contatoPrincipal']
      });
    }

    // Verifica se o fornecedor existe
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    // Validação do CNPJ
    if (!validarCNPJ(cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    const cnpjFormatado = cnpj.replace(/\D/g, '');

    // Atualização
    const [updated] = await Fornecedor.update(
      {
        nomeEmpresa: nomeEmpresa.trim(),
        cnpj: cnpjFormatado,
        endereco: endereco.trim(),
        telefone: telefone?.trim() || null,
        email: email?.trim() || null,
        contatoPrincipal: contatoPrincipal.trim()
      },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(500).json({ erro: 'Nenhum registro foi atualizado' });
    }

    // Retorna o fornecedor atualizado
    const fornecedorAtualizado = await Fornecedor.findByPk(req.params.id);
    res.json({
      mensagem: 'Fornecedor atualizado com sucesso',
      dados: fornecedorAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ 
      erro: 'Erro ao atualizar fornecedor',
      detalhe: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE - Remover fornecedor
router.delete('/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    const deleted = await Fornecedor.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(500).json({ erro: 'Nenhum registro foi removido' });
    }

    res.json({ 
      mensagem: 'Fornecedor removido com sucesso',
      dados: fornecedor
    });

  } catch (error) {
    console.error('Erro ao remover fornecedor:', error);
    res.status(500).json({ 
      erro: 'Não foi possível remover o fornecedor',
      detalhe: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;