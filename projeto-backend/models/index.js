const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Produto = require('./produto')(sequelize, DataTypes);
db.Fornecedor = require('./fornecedor')(sequelize, DataTypes);
db.ProdutoFornecedor = require('./produtoFornecedor')(sequelize, DataTypes);

db.Produto.belongsToMany(db.Fornecedor, { through: db.ProdutoFornecedor });
db.Fornecedor.belongsToMany(db.Produto, { through: db.ProdutoFornecedor });

module.exports = db;