module.exports = (sequelize, DataTypes) => {
  const ProdutoFornecedor = sequelize.define('produtoFornecedor', {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  return ProdutoFornecedor;
};
