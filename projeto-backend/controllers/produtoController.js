// Simulando dados (ou pode usar seu model Sequelize)
const produtos = [
  { id: 1, nome: 'Produto 1', preco: 10.0 },
  { id: 2, nome: 'Produto 2', preco: 20.0 },
];

exports.listarProdutos = (req, res) => {
  res.json(produtos);
};

exports.criarProduto = (req, res) => {
  const novoProduto = req.body; // esperar {nome, preco} no body
  novoProduto.id = produtos.length + 1;
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
};
