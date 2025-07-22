const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigoBarras: {
    type: DataTypes.STRING,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataValidade: {
    type: DataTypes.DATE,
  },
});

module.exports = Produto;