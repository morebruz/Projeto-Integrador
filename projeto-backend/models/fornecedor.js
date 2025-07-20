module.exports = (sequelize, DataTypes) => {
  const Fornecedor = sequelize.define('fornecedor', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Fornecedor;
};