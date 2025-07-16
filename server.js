const express = require("express");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { lerUsuarios, salvarUsuarios } = require("./users-control.js");

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Rota principal - GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota GET /list-users/:count?
app.get("/list-users/:count?", async (req, res) => {
  let num = parseInt(req.params.count, 10);
  if (isNaN(num)) num = 100;
  num = Math.max(1, Math.min(10000, num));

  console.log(`Solicitando ate ${num} usuarios...`);
  try {
    const todos = await lerUsuarios();
    const slice = todos.slice(0, num);
    res.json(slice);
  } catch (err) {
    console.error("Falha ao ler usuarios:", err);
    res.status(500).json({ error: "Nao foi possivel ler usuarios." });
  }
});

// Rota POST /cadastrar-usuario
app.post("/cadastrar-usuario", async (req, res) => {
  try {
    const usuarios = await lerUsuarios();
    const novoUsuario = {
      id: uuidv4(),
      nome: req.body.nome,
      idade: req.body.idade,
      endereco: req.body.endereco,
      email: req.body.email,
    };
    usuarios.push(novoUsuario);
    await salvarUsuarios(usuarios);
    console.log(`Usuario cadastrado: ${JSON.stringify(novoUsuario)}`);
    res.status(201).json({
      ok: true,
      message: "Usuario cadastrado com sucesso!",
      usuario: novoUsuario,
    });
  } catch (err) {
    console.error("Erro ao cadastrar usuario:", err);
    res.status(500).json({ error: "Nao foi possivel cadastrar usuario." });
  }
});

// -----------------------------------------------------------------------------
// NOVAS ROTAS - ATUALIZAR E REMOVER
// -----------------------------------------------------------------------------

/**
 * Rota GET /usuarios/:id
 * Retorna um usuário específico pelo ID.
 * Essencial para preencher o formulário de edição.
 */
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuarios = await lerUsuarios();
    const usuario = usuarios.find(u => u.id === req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario nao encontrado." });
    }
    res.json(usuario);
  } catch (err) {
    console.error("Falha ao buscar usuario:", err);
    res.status(500).json({ error: "Nao foi possivel buscar o usuario." });
  }
});

/**
 * Rota PUT /usuarios/:id (RF0005: Atualizar)
 * Atualiza os dados de um usuário específico.
 */
app.put("/usuarios/:id", async (req, res) => {
  try {
    const usuarios = await lerUsuarios();
    const index = usuarios.findIndex(u => u.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Usuario nao encontrado." });
    }

    // Mescla o usuário existente com os novos dados do corpo da requisição
    const usuarioAtualizado = { ...usuarios[index], ...req.body };
    usuarios[index] = usuarioAtualizado;

    await salvarUsuarios(usuarios);
    console.log(`Usuario atualizado: ${JSON.stringify(usuarioAtualizado)}`);
    res.json({
      ok: true,
      message: "Usuario atualizado com sucesso!",
      usuario: usuarioAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar usuario:", err);
    res.status(500).json({ error: "Nao foi possivel atualizar o usuario." });
  }
});

/**
 * Rota DELETE /usuarios/:id (RF0006: Remover)
 * Remove um usuário do sistema pelo ID.
 */
app.delete("/usuarios/:id", async (req, res) => {
  try {
    let usuarios = await lerUsuarios();
    const tamanhoOriginal = usuarios.length;
    
    // Filtra o array, mantendo todos os usuários exceto o que corresponde ao ID
    usuarios = usuarios.filter(u => u.id !== req.params.id);

    if (usuarios.length === tamanhoOriginal) {
      return res.status(404).json({ error: "Usuario nao encontrado." });
    }

    await salvarUsuarios(usuarios);
    console.log(`Usuario com ID ${req.params.id} removido.`);
    res.status(200).json({ 
      ok: true, 
      message: "Usuario removido com sucesso!" 
    });
  } catch (err) {
    console.error("Erro ao remover usuario:", err);
    res.status(500).json({ error: "Nao foi possivel remover o usuario." });
  }
});

// Inicia o servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
