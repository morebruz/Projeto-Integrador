const { DataTypes } = require('sequelize');
const sequelize = require('../database/config'); // Verifique se este caminho está correto

const Fornecedor = sequelize.define('Fornecedor', {
  nomeEmpresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contatoPrincipal: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Fornecedor;