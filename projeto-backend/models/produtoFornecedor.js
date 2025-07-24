const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
  const ProdutoFornecedor = sequelize.define('produtoFornecedor', {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  module.exports = ProdutoFornecedor;
