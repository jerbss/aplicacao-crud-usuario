// teste-ordenacao-bubblesort-interativo.js
const readline = require("readline");

// Delay opcional para visualização lenta (pode ajustar!)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Interface para esperar ENTER
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Normaliza strings para comparação neutra
function comparaStrings(a, b, fullCompare = true) {
  const sa = a
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const sb = b
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  const len = fullCompare ? Math.max(sa.length, sb.length) : 3;

  for (let i = 0; i < len; i++) {
    const c1 = sa.charCodeAt(i) || 0;
    const c2 = sb.charCodeAt(i) || 0;
    if (c1 < c2) return -1;
    if (c1 > c2) return 1;
  }

  return 0;
}

// Versão interativa do Bubble Sort
async function bubbleSortInterativo(arr, key, crescente = true) {
  const tipo = typeof arr[0][key];
  const n = arr.length;

  console.log("\n🎬 Iniciando ordenação passo a passo...\n");

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      let a = arr[j][key];
      let b = arr[j + 1][key];
      let comp = tipo === "string" ? comparaStrings(a, b) : a - b;

      console.log(
        `🔍 Comparando "${a}" com "${b}" → ${
          comp < 0 ? "a < b" : comp > 0 ? "a > b" : "iguais"
        }`
      );

      if ((crescente && comp > 0) || (!crescente && comp < 0)) {
        console.log(`🔄 Trocando "${a}" com "${b}"`);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        console.table(arr);
      }

      // Espera ENTER para continuar para o próximo passo
      await new Promise((resolve) =>
        rl.question("▶️ Pressione ENTER para continuar...\n", resolve)
      );
    }
  }

  console.log("\n✅ Ordenação concluída!");
  rl.close();
}

// Lista a ser ordenada
const nomes = [
  { nome: "Érica" },
  { nome: "ana" },
  { nome: "joão" },
  { nome: "Álvaro" },
  { nome: "caio" },
  { nome: "zé" },
  { nome: "Bia" },
  { nome: "carlos" },
  { nome: "Débora" },
];

// Exibe a lista original
console.log("\n📋 Lista ORIGINAL:");
console.table(nomes);

// Inicia o processo de ordenação interativo
bubbleSortInterativo(nomes, "nome", true);
