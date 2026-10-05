<div align="center">

# Controle de Estoque

### Sistema web full stack para gerenciamento de produtos, formulários e movimentações de estoque

<br>

<img src="https://skillicons.dev/icons?i=react,ts,vite,nodejs,express,postgres,prisma,js,html,css,git,github&perline=12" alt="Tecnologias utilizadas" />

<br><br>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

<br>

> **Projeto desenvolvido como treino para o SAEP**
> *(Sistema de Avaliação da Educação Profissional)*

</div>

---

## Sumário

- [🎯 Sobre o projeto](#-sobre-o-projeto)
- [🎓 Treino para o SAEP](#-treino-para-o-saep)
- [🧰 Tecnologias](#-tecnologias)
- [🧠 Como funciona](#-como-funciona)
- [🗄️ Banco de dados](#️-banco-de-dados)
- [🔌 Rotas da API](#-rotas-da-api)
- [📁 Estrutura de pastas](#-estrutura-de-pastas)
- [🚀 Como rodar o projeto](#-como-rodar-o-projeto)
- [🛣️ Próximos passos](#️-próximos-passos)
- [👨‍💻 Autor](#-autor)

---

##  Sobre o projeto

O **Controle de Estoque** é uma aplicação **full stack** que permite:

-  **Fazer login** com e-mail e senha (senha protegida com hash)
-  **Cadastrar, listar, editar e excluir produtos**
-  **Registrar formulários** vinculados a um usuário
-  **Controlar movimentações** de entrada e saída do estoque

O projeto é dividido em duas partes independentes que conversam entre si por uma **API REST**:

| Parte | Responsabilidade |
| :--- | :--- |
|  **Frontend** | Interface que o usuário vê e usa (telas de login, home e produtos) |
|  **Backend** | Regras de negócio, autenticação e acesso ao banco de dados |

---

##  Treino para o SAEP

Este repositório foi criado como **treino para o SAEP**, a avaliação da educação profissional.

Ele serve para praticar, na prática, os conteúdos mais cobrados em desenvolvimento de sistemas:

- Modelagem e criação de **banco de dados relacional**
-  Construção de uma **API REST** com operações **CRUD**
-  **Integração entre frontend e backend**
-  **Autenticação** e criptografia de senhas
-  Organização de projeto e **versionamento com Git/GitHub**

---

##  Tecnologias

###  Frontend

| Tecnologia | Para que serve |
| :---: | :--- |
| <img src="https://skillicons.dev/icons?i=react" width="40" /><br>**React 19** | Criação da interface com componentes |
| <img src="https://skillicons.dev/icons?i=ts" width="40" /><br>**TypeScript** | JavaScript com tipagem, mais seguro |
| <img src="https://skillicons.dev/icons?i=vite" width="40" /><br>**Vite** | Servidor de desenvolvimento e build rápido |
| <img src="https://skillicons.dev/icons?i=html" width="40" /> <img src="https://skillicons.dev/icons?i=css" width="40" /><br>**HTML + CSS** | Estrutura e estilo das telas |

###  Backend

| Tecnologia | Para que serve |
| :---: | :--- |
| <img src="https://skillicons.dev/icons?i=nodejs" width="40" /><br>**Node.js** | Ambiente que executa o JavaScript no servidor |
| <img src="https://skillicons.dev/icons?i=express" width="40" /><br>**Express 5** | Criação das rotas da API |
| <img src="https://skillicons.dev/icons?i=prisma" width="40" /><br>**Prisma 7** | ORM: conversa com o banco usando código |
| <img src="https://skillicons.dev/icons?i=postgres" width="40" /><br>**PostgreSQL** | Banco de dados relacional |
| 🔒 **bcryptjs** | Criptografia das senhas |
| 🌐 **CORS** | Permite o frontend acessar a API |

---

##  Como funciona

O fluxo geral do sistema é este:

```mermaid
flowchart LR
    A["👤 Usuário<br>(navegador)"] -->|interage| B["🎨 Frontend<br>React + Vite<br>:5173"]
    B -->|"fetch (JSON)"| C["⚙️ Backend<br>Express<br>:3000"]
    C -->|Prisma ORM| D[("🗄️ PostgreSQL")]
    D -->|dados| C
    C -->|"resposta (JSON)"| B
    B -->|mostra na tela| A
```

###  Fluxo de login

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as 🎨 Frontend
    participant B as ⚙️ Backend
    participant D as 🗄️ Banco

    U->>F: Digita e-mail e senha
    F->>B: POST /login
    B->>D: Busca usuário pelo e-mail
    D-->>B: Retorna usuário (senha com hash)
    B->>B: bcrypt compara a senha
    alt Senha correta
        B-->>F: 200 + dados do usuário
        F-->>U: Abre a tela Home
    else Senha incorreta
        B-->>F: 401 + mensagem de erro
        F-->>U: Exibe "e-mail ou senha incorretos"
    end
```

###  Navegação do frontend

O componente `App.tsx` controla qual tela aparece:

1. **Sem usuário logado** → mostra a tela de **Login**
2. **Logado** → mostra a **Home** com os cards de acesso
3. **Clicou em "Gerenciar produtos"** → mostra a tela de **Produtos** (CRUD completo)
4. **Clicou em "Sair"** → volta para o Login

---

##  Banco de dados

O banco possui 4 tabelas relacionadas:

```mermaid
erDiagram
    USUARIO ||--o{ FORMULARIO : "preenche"
    FORMULARIO ||--o{ MOVIMENTACAO : "contém"
    PRODUTOS ||--o{ MOVIMENTACAO : "é movimentado em"

    USUARIO {
        int id PK
        string nome
        string email UK
        string senha
    }
    FORMULARIO {
        int id PK
        datetime data
        int usuario_id FK
    }
    MOVIMENTACAO {
        int id PK
        string tipo
        int quantidade
        datetime data_movimentacao
        int formulario_id FK
        int produto_id FK
    }
    PRODUTOS {
        int id PK
        string nome
        int estoque
        int quantidade
    }
```

---

##  Rotas da API

Base URL: `http://localhost:3000`

###  Autenticação

| Método | Rota | Descrição |
| :---: | :--- | :--- |
| `POST` | `/login` | Autentica o usuário |

###  Usuários

| Método | Rota | Descrição |
| :---: | :--- | :--- |
| `GET` | `/usuarios` | Lista todos os usuários |
| `GET` | `/usuarios/:id` | Busca um usuário |
| `POST` | `/usuarios` | Cria um usuário |
| `PUT` | `/usuarios/:id` | Atualiza um usuário |
| `DELETE` | `/usuarios/:id` | Exclui um usuário |

###  Produtos

| Método | Rota | Descrição |
| :---: | :--- | :--- |
| `GET` | `/produtos` | Lista todos os produtos |
| `GET` | `/produtos/:id` | Busca um produto |
| `POST` | `/produtos` | Cadastra um produto |
| `PUT` | `/produtos/:id` | Atualiza um produto |
| `DELETE` | `/produtos/:id` | Exclui um produto |

###  Formulários

| Método | Rota | Descrição |
| :---: | :--- | :--- |
| `GET` | `/formularios` | Lista todos os formulários |
| `GET` | `/formularios/:id` | Busca um formulário |
| `POST` | `/formularios` | Cria um formulário |
| `PUT` | `/formularios/:id` | Atualiza um formulário |
| `DELETE` | `/formularios/:id` | Exclui um formulário |

###  Movimentações

| Método | Rota | Descrição |
| :---: | :--- | :--- |
| `GET` | `/movimentacoes` | Lista todas as movimentações |
| `GET` | `/movimentacoes/:id` | Busca uma movimentação |
| `POST` | `/movimentacoes` | Registra uma movimentação |
| `PUT` | `/movimentacoes/:id` | Atualiza uma movimentação |
| `DELETE` | `/movimentacoes/:id` | Exclui uma movimentação |

<details>
<summary>📨 <b>Exemplo de requisição (clique para abrir)</b></summary>

<br>

**Criar um produto**

```http
POST /produtos
Content-Type: application/json

{
  "nome": "Parafuso",
  "estoque": 10,
  "quantidade": 100
}
```

**Resposta `201 Created`**

```json
{
  "id": 1,
  "nome": "Parafuso",
  "estoque": 10,
  "quantidade": 100
}
```

</details>

---

## Estrutura de pastas

```
📦 implementacao-de-sistemas
├── 📂 backend
│   ├── 📂 prisma
│   │   ├── 📂 migrations        # Histórico de alterações do banco
│   │   └── 📄 schema.prisma     # Modelos das tabelas
│   ├── 📂 generated/prisma      # Client do Prisma gerado
│   ├── 📂 src
│   │   ├── 📂 lib
│   │   │   └── 📄 prisma.ts     # Conexão com o banco
│   │   └── 📄 server.js         # Servidor Express e todas as rotas
│   ├── 📄 prisma7.config.ts     # Configuração do Prisma
│   └── 📄 package.json
│
├── 📂 frontend
│   ├── 📂 src
│   │   ├── 📂 pages
│   │   │   ├── 📄 Login.tsx     # Tela de login
│   │   │   ├── 📄 Home.tsx      # Tela inicial
│   │   │   └── 📄 Produtos.tsx  # CRUD de produtos
│   │   ├── 📄 App.tsx           # Controle de telas
│   │   ├── 📄 main.tsx          # Ponto de entrada do React
│   │   └── 📄 index.css         # Estilos globais
│   ├── 📄 index.html
│   ├── 📄 vite.config.ts
│   ├── 📄 tsconfig.json
│   └── 📄 package.json
│
└── 📄 README.md
```

---

## Como rodar o projeto

###  Pré-requisitos

- <img src="https://skillicons.dev/icons?i=nodejs" width="18" /> **Node.js 22.18 ou superior**
- <img src="https://skillicons.dev/icons?i=postgres" width="18" /> **PostgreSQL** instalado e rodando
- <img src="https://skillicons.dev/icons?i=git" width="18" /> **Git**

### Clonar o repositório

```bash
git clone https://github.com/kauanyferreirabairros/treino-saep.git
cd implementacao-de-sistemas
```

### Configurar e iniciar o backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` com a conexão do seu banco:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

Aplique as migrations e inicie o servidor:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npm run dev
```

O backend ficará disponível em **http://localhost:3000**

### Iniciar o frontend

Em **outro terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ O frontend ficará disponível em **http://localhost:5173**

### Criar o primeiro usuário

Como o sistema exige login, crie um usuário pela API:

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Seu Nome","email":"voce@email.com","senha":"123456"}'
```

Depois é só entrar na tela de login com esse e-mail e senha. 🎉


---

##  Autora

<div align="center">

Feito por **Kauany Bairros**

[![GitHub](https://img.shields.io/badge/GitHub-kauanyferreirabairros-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kauanyferreirabairros)

</div>
