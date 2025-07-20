const db = require('../models');
const Fornecedor = db.Fornecedor;

exports.criar = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.create(req.body);
    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll();
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    await fornecedor.update(req.body);
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    await fornecedor.destroy();
    res.json({ message: 'Fornecedor deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};