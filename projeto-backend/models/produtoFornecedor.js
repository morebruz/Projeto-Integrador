const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
  const ProdutoFornecedor = sequelize.define('produtoFornecedor', {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  module.exports = ProdutoFornecedor;
