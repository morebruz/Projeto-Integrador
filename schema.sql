PRAGMA foreign_keys = ON;

-- Tabela de fornecedor
CREATE TABLE IF NOT EXISTS fornecedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    endereco TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    contato_principal TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produto
CREATE TABLE IF NOT EXISTS produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigo_barras TEXT UNIQUE,
    descricao TEXT NOT NULL,
    quantidade INTEGER DEFAULT 0,
    categoria TEXT,
    data_validade TEXT,
    imagem TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de associação entre produto e fornecedor
CREATE TABLE IF NOT EXISTS associacao (
    produto_id INTEGER NOT NULL,
    fornecedor_id INTEGER NOT NULL,
    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (produto_id, fornecedor_id),
    FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id) ON DELETE CASCADE
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_fornecedor_cnpj ON fornecedor(cnpj);
CREATE INDEX IF NOT EXISTS idx_produto_codigo ON produto(codigo_barras);
CREATE INDEX IF NOT EXISTS idx_associacao_produto ON associacao(produto_id);
CREATE INDEX IF NOT EXISTS idx_associacao_fornecedor ON associacao(fornecedor_id);

-- Inserção de dados iniciais (opcional)
INSERT OR IGNORE INTO fornecedor (nome, cnpj, endereco, telefone, email, contato_principal) 
VALUES ('Fornecedor Padrão', '00.000.000/0000-00', 'Endereço padrão', '(00) 0000-0000', 'contato@fornecedor.com', 'Fulano de Tal');

-- Mensagem de confirmação
SELECT 'Banco de dados criado com sucesso!' as mensagem;