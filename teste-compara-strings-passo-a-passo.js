// teste-comparacao-strings.js
const readline = require("readline");

// Delay artificial (tipo "slow mode")
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Função para comparar strings com logs passo a passo
 */
async function comparaStringsInterativa(a, b, fullCompare = true) {
  console.log(`\n🔍 Comparando: "${a}" vs "${b}"`);

  const sa = a
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const sb = b
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  console.log(`➡️  Normalizado "${a}" → "${sa}"`);
  console.log(`➡️  Normalizado "${b}" → "${sb}"`);

  const len = fullCompare ? Math.max(sa.length, sb.length) : 3;

  for (let i = 0; i < len; i++) {
    const charA = sa[i] || "(vazio)";
    const charB = sb[i] || "(vazio)";
    const codeA = sa.charCodeAt(i) || 0;
    const codeB = sb.charCodeAt(i) || 0;

    console.log(
      `🔠 Comparando caractere ${
        i + 1
      }: '${charA}' (${codeA}) vs '${charB}' (${codeB})`
    );

    await sleep(400); // Pequeno atraso pra visualização

    if (codeA < codeB) {
      console.log(`✅ Resultado: "${a}" < "${b}"`);
      return -1;
    }
    if (codeA > codeB) {
      console.log(`✅ Resultado: "${a}" > "${b}"`);
      return 1;
    }
  }

  console.log(`✅ Resultado: "${a}" == "${b}"`);
  return 0;
}

// Lista de testes
const exemplos = [
  ["é", "e"],
  ["Álvaro", "ana"],
  ["João", "joao"],
  ["caio", "Caio"],
  ["joão", "José"],
  ["banana", "Banana"],
  ["Ação", "acordo"],
];

// Interface de linha de comando para navegar entre exemplos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let indice = 0;

async function executarComparacoes() {
  console.log("\n🧪 Demonstração dinâmica de comparação de strings\n");
  console.log("Strings a serem comparadas:\n");

  exemplos.forEach(([a, b], i) => {
    console.log(`  ${i + 1}. "${a}" vs "${b}"`);
  });

  while (indice < exemplos.length) {
    const [a, b] = exemplos[indice];
    await comparaStringsInterativa(a, b);
    indice++;

    if (indice < exemplos.length) {
      await new Promise((resolve) =>
        rl.question("\n▶️ Pressione ENTER para o próximo...\n", resolve)
      );
    } else {
      console.log("\n🏁 Fim da demonstração.");
      rl.close();
    }
  }
}

executarComparacoes();
