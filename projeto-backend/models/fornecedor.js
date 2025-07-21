const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fornecedor = sequelize.define('Fornecedor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true
  },
  telefone: DataTypes.STRING
});

module.exports = Fornecedor;