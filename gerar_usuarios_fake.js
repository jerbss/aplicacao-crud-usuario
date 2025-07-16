//gerar_usuarios_fake.js

const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const TOTAL_USUARIOS = 10_000;
const LOTE = 100;
const ARQUIVO = "usuarios.json";

function gerarUsuario() {
  return {
    id: uuidv4(),
    nome: faker.person.fullName(),
    idade: faker.number.int({ min: 18, max: 90 }),
    endereco: faker.location.streetAddress(),
    email: faker.internet.email(),
  };
}

async function gerarEGravarUsuarios() {
  console.log(
    `🛠️ Iniciando geração de ${TOTAL_USUARIOS} usuários em lotes de ${LOTE}...`
  );

  fs.writeFileSync(ARQUIVO, "[\n"); // Início do array

  for (let i = 0; i < TOTAL_USUARIOS; i += LOTE) {
    const usuarios = [];

    for (let j = 0; j < LOTE && i + j < TOTAL_USUARIOS; j++) {
      usuarios.push(gerarUsuario());
    }

    const jsonLote = JSON.stringify(usuarios, null, 2);
    fs.appendFileSync(ARQUIVO, jsonLote.slice(1, -1)); // remove [ e ]

    if (i + LOTE < TOTAL_USUARIOS) {
      fs.appendFileSync(ARQUIVO, ",\n");
    }
  }

  fs.appendFileSync(ARQUIVO, "\n]");
  console.log(`✅ Arquivo "${ARQUIVO}" gerado com sucesso!`);
}

gerarEGravarUsuarios();
