const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Associacao = sequelize.define('Associacao', {
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Produtos',  // nome da tabela Produto no banco
      key: 'id'
    }
  },
  fornecedorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Fornecedores',  // nome da tabela Fornecedor no banco
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'associacoes'  // nome customizado para a tabela no banco
});

// Importa os models
const Fornecedor = require('./fornecedor');
const Produto = require('./produto');

// Define associação muitos para muitos
Fornecedor.belongsToMany(Produto, { through: Associacao, foreignKey: 'fornecedorId', otherKey: 'produtoId' });
Produto.belongsToMany(Fornecedor, { through: Associacao, foreignKey: 'produtoId', otherKey: 'fornecedorId' });

module.exports = Associacao;