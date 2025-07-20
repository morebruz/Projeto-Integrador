module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigoBarras: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataValidade: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING, //url
      allowNull: true
    }
  });

  return Produto;
};