const Fornecedor = require('../models/fornecedor');


exports.create = async (req, res) => {
  try {
    const { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;
    
    
    const existeFornecedor = await Fornecedor.findOne({ where: { cnpj } });
    if (existeFornecedor) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }

    const fornecedor = await Fornecedor.create({
      nomeEmpresa,
      cnpj,
      endereco,
      telefone,
      email,
      contatoPrincipal
    });

    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.findAll = async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll();
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};