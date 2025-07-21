const sequelize = require('../config/database');
const Fornecedor = require('./fornecedor');
const Produto = require('./produto');
const ProdutoFornecedor = require('./produtoFornecedor');

// Relação N:N
Produto.belongsToMany(Fornecedor, { through: ProdutoFornecedor });
Fornecedor.belongsToMany(Produto, { through: ProdutoFornecedor });

module.exports = {
  sequelize,
  Fornecedor,
  Produto,
  ProdutoFornecedor
};