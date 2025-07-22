const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Associacao = sequelize.define('Associacao', {

});


const Fornecedor = require('./fornecedor');
const Produto = require('./produto');

Fornecedor.belongsToMany(Produto, { through: 'Associacao' });
Produto.belongsToMany(Fornecedor, { through: 'Associacao' });

module.exports = Associacao;