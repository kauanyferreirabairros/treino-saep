interface HomeProps {
  usuario: any;
  onLogout: () => void;
  onProdutos: () => void;
}

function Home({ usuario, onLogout, onProdutos }: HomeProps) {
  return (
    <div className="home-container">
      <header className="header">
        <div>
          <h1>Controle de Estoque</h1>
          <p>Sistema de gerenciamento</p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Sair
        </button>
      </header>

      <main className="home-content">
        <h2>Olá, {usuario.nome}!</h2>

        <p>
          Bem-vindo ao sistema de controle de estoque.
        </p>

        <div className="cards">
          <div className="card">
            <h3>Produtos</h3>

            <p>
              Cadastre, edite, consulte e exclua produtos.
            </p>

            <button onClick={onProdutos}>
              Gerenciar produtos
            </button>
          </div>

          <div className="card">
            <h3>Formulários</h3>

            <p>
              Consulte os formulários cadastrados.
            </p>

            <button>
              Ver formulários
            </button>
          </div>

          <div className="card">
            <h3>Movimentações</h3>

            <p>
              Controle as entradas e saídas do estoque.
            </p>

            <button>
              Ver movimentações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;