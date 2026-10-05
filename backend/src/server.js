import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.ts";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API funcionando"
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios"
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email
      }
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Email ou senha incorretos"
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "Email ou senha incorretos"
      });
    }

    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao realizar login"
    });
  }
});

// USUÁRIOS

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();

    res.json(usuarios);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar usuários"
    });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: id
      }
    });

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar usuário"
    });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios"
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada
      }
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar usuário"
    });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome, email, senha } = req.body;

    const dados = {
      nome,
      email
    };

    if (senha) {
      dados.senha = await bcrypt.hash(senha, 10);
    }

    const usuario = await prisma.usuario.update({
      where: {
        id: id
      },
      data: dados
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar usuário"
    });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.usuario.delete({
      where: {
        id: id
      }
    });

    res.json({
      mensagem: "Usuário excluído com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir usuário"
    });
  }
});

// FORMULÁRIOS

app.get("/formularios", async (req, res) => {
  try {
    const formularios = await prisma.formulario.findMany({
      include: {
        usuario: true,
        movimentacoes: true
      }
    });

    res.json(formularios);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar formulários"
    });
  }
});

app.get("/formularios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const formulario = await prisma.formulario.findUnique({
      where: {
        id: id
      },
      include: {
        usuario: true,
        movimentacoes: true
      }
    });

    if (!formulario) {
      return res.status(404).json({
        mensagem: "Formulário não encontrado"
      });
    }

    res.json(formulario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar formulário"
    });
  }
});

app.post("/formularios", async (req, res) => {
  try {
    const { data, usuarioId } = req.body;

    const formulario = await prisma.formulario.create({
      data: {
        data: new Date(data),
        usuarioId: Number(usuarioId)
      }
    });

    res.status(201).json(formulario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar formulário"
    });
  }
});

app.put("/formularios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { data, usuarioId } = req.body;

    const formulario = await prisma.formulario.update({
      where: {
        id: id
      },
      data: {
        data: new Date(data),
        usuarioId: Number(usuarioId)
      }
    });

    res.json(formulario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar formulário"
    });
  }
});

app.delete("/formularios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.formulario.delete({
      where: {
        id: id
      }
    });

    res.json({
      mensagem: "Formulário excluído com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir formulário"
    });
  }
});

// PRODUTOS

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        movimentacoes: true
      }
    });

    res.json(produtos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar produtos"
    });
  }
});

app.get("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const produto = await prisma.produto.findUnique({
      where: {
        id: id
      },
      include: {
        movimentacoes: true
      }
    });

    if (!produto) {
      return res.status(404).json({
        mensagem: "Produto não encontrado"
      });
    }

    res.json(produto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar produto"
    });
  }
});

app.post("/produtos", async (req, res) => {
  try {
    const { nome, estoque, quantidade } = req.body;

    if (!nome || estoque === undefined || quantidade === undefined) {
      return res.status(400).json({
        mensagem: "Nome, estoque e quantidade são obrigatórios"
      });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        estoque: Number(estoque),
        quantidade: Number(quantidade)
      }
    });

    res.status(201).json(produto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar produto"
    });
  }
});

app.put("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome, estoque, quantidade } = req.body;

    const produto = await prisma.produto.update({
      where: {
        id: id
      },
      data: {
        nome,
        estoque: Number(estoque),
        quantidade: Number(quantidade)
      }
    });

    res.json(produto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar produto"
    });
  }
});

app.delete("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.produto.delete({
      where: {
        id: id
      }
    });

    res.json({
      mensagem: "Produto excluído com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir produto"
    });
  }
});

// MOVIMENTAÇÕES

app.get("/movimentacoes", async (req, res) => {
  try {
    const movimentacoes = await prisma.movimentacao.findMany({
      include: {
        produto: true,
        formulario: {
          include: {
            usuario: true
          }
        }
      }
    });

    res.json(movimentacoes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar movimentações"
    });
  }
});

app.get("/movimentacoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const movimentacao = await prisma.movimentacao.findUnique({
      where: {
        id: id
      },
      include: {
        produto: true,
        formulario: {
          include: {
            usuario: true
          }
        }
      }
    });

    if (!movimentacao) {
      return res.status(404).json({
        mensagem: "Movimentação não encontrada"
      });
    }

    res.json(movimentacao);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar movimentação"
    });
  }
});

app.post("/movimentacoes", async (req, res) => {
  try {
    const {
      tipo,
      quantidade,
      data,
      formularioId,
      produtoId
    } = req.body;

    const movimentacao = await prisma.movimentacao.create({
      data: {
        tipo,
        quantidade: Number(quantidade),
        data: new Date(data),
        formularioId: Number(formularioId),
        produtoId: Number(produtoId)
      }
    });

    res.status(201).json(movimentacao);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar movimentação"
    });
  }
});

app.put("/movimentacoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      tipo,
      quantidade,
      data,
      formularioId,
      produtoId
    } = req.body;

    const movimentacao = await prisma.movimentacao.update({
      where: {
        id: id
      },
      data: {
        tipo,
        quantidade: Number(quantidade),
        data: new Date(data),
        formularioId: Number(formularioId),
        produtoId: Number(produtoId)
      }
    });

    res.json(movimentacao);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar movimentação"
    });
  }
});

app.delete("/movimentacoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.movimentacao.delete({
      where: {
        id: id
      }
    });

    res.json({
      mensagem: "Movimentação excluída com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir movimentação"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});