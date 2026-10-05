import { FormEvent, useEffect, useState } from "react";

interface Produto {
  id: number;
  nome: string;
  estoque: number;
  quantidade: number;
}

function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [estoque, setEstoque] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");

  async function carregarProdutos() {
    try {
      const resposta = await fetch("http://localhost:3000/produtos");

      if (!resposta.ok) {
        throw new Error();
      }

      const dados = await resposta.json();
      setProdutos(dados);
    } catch {
      setErro("Não foi possível carregar os produtos.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function salvarProduto(event: FormEvent) {
    event.preventDefault();
    setErro("");

    const produto = {
      nome,
      estoque: Number(estoque),
      quantidade: Number(quantidade),
    };

    try {
      const url = editandoId
        ? `http://localhost:3000/produtos/${editandoId}`
        : "http://localhost:3000/produtos";

      const metodo = editandoId ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "Erro ao salvar produto.");
        return;
      }

      limparFormulario();
      carregarProdutos();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  function editarProduto(produto: Produto) {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setEstoque(String(produto.estoque));
    setQuantidade(String(produto.quantidade));
  }

  async function excluirProduto(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/produtos/${id}`,
        {
          method: "DELETE",
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "Erro ao excluir produto.");
        return;
      }

      carregarProdutos();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  function limparFormulario() {
    setNome("");
    setEstoque("");
    setQuantidade("");
    setEditandoId(null);
  }

  return (
    <div className="produtos-container">
      <div className="produtos-header">
        <div>
          <h2>Produtos</h2>
          <p>Gerencie os produtos do estoque.</p>
        </div>

        <button onClick={limparFormulario}>
          Novo produto
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      <div className="produto-form-card">
        <h3>
          {editandoId ? "Editar produto" : "Cadastrar produto"}
        </h3>

        <form onSubmit={salvarProduto}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                type="text"
                placeholder="Nome do produto"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estoque">Estoque</label>

              <input
                id="estoque"
                type="number"
                min="0"
                value={estoque}
                onChange={(event) => setEstoque(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">Quantidade</label>

              <input
                id="quantidade"
                type="number"
                min="0"
                value={quantidade}
                onChange={(event) =>
                  setQuantidade(event.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit">
              {editandoId ? "Salvar alterações" : "Cadastrar"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="cancel-button"
                onClick={limparFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="produto-list-card">
        <h3>Produtos cadastrados</h3>

        {produtos.length === 0 ? (
          <p className="sem-produtos">
            Nenhum produto cadastrado.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Estoque</th>
                  <th>Quantidade</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.estoque}</td>
                    <td>{produto.quantidade}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="edit-button"
                          onClick={() => editarProduto(produto)}
                        >
                          Editar
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => excluirProduto(produto.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Produtos;