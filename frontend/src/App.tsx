import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";

type Tela = "home" | "produtos";

function App() {
  const [usuario, setUsuario] = useState<any>(null);
  const [tela, setTela] = useState<Tela>("home");

  function sair() {
    setUsuario(null);
    setTela("home");
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  if (tela === "produtos") {
    return (
      <div>
        <div className="voltar-bar">
          <button onClick={() => setTela("home")}>← Voltar</button>
        </div>
        <Produtos />
      </div>
    );
  }

  return (
    <Home
      usuario={usuario}
      onLogout={sair}
      onProdutos={() => setTela("produtos")}
    />
  );
}

export default App;
