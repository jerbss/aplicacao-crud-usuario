// teste-ordenacao-bubblesort.js

/**
 * Função para comparar strings ignorando acentos e diferenciação entre maiúsculas/minúsculas.
 *
 * @param {string} a - Primeira string a ser comparada
 * @param {string} b - Segunda string a ser comparada
 * @param {boolean} fullCompare - Se true, compara todas as letras; se false, só os 3 primeiros caracteres
 * @returns {number} - Retorna -1 se a < b, 1 se a > b, ou 0 se forem equivalentes
 */
function comparaStrings(a, b, fullCompare = true) {
  // Remove acentos (NFD + replace) e transforma para minúsculas
  const sa = a
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const sb = b
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  // Define quantos caracteres serão comparados
  const len = fullCompare ? Math.max(sa.length, sb.length) : 3;

  // Compara caractere por caractere (via charCode)
  for (let i = 0; i < len; i++) {
    const c1 = sa.charCodeAt(i) || 0;
    const c2 = sb.charCodeAt(i) || 0;

    if (c1 < c2) return -1;
    if (c1 > c2) return 1;
  }

  return 0; // Strings são equivalentes (na parte analisada)
}

/**
 * Função de ordenação de um array de objetos, usando o algoritmo Bubble Sort.
 * Permite ordenação crescente ou decrescente, e lida com strings ou números.
 *
 * @param {Array<Object>} arr - Array de objetos a serem ordenados
 * @param {string} key - Nome da chave a ser usada para ordenação
 * @param {boolean} crescente - true para ordem crescente, false para decrescente
 */
function bubbleSort(arr, key, crescente = true) {
  const tipo = typeof arr[0][key]; // Detecta se o campo é string ou número
  const n = arr.length;

  // Laços do Bubble Sort (complexidade O(n²))
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      // Pega os valores a serem comparados
      let a = arr[j][key];
      let b = arr[j + 1][key];

      // Decide como comparar: com comparaStrings se for string, ou subtração se for número
      let comp = tipo === "string" ? comparaStrings(a, b) : a - b;

      // Mostra no console a comparação feita
      console.log(
        `Comparando "${a}" com "${b}" → resultado: ${
          comp < 0 ? "a < b" : comp > 0 ? "a > b" : "iguais"
        }`
      );

      // Se a ordem estiver incorreta, faz a troca (destructuring swap)
      if ((crescente && comp > 0) || (!crescente && comp < 0)) {
        console.log(`🔄 Trocando "${a}" com "${b}"`);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

// ============================================================================
// LISTA DE TESTE
// ============================================================================

// Array de objetos com nomes a serem ordenados
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

// Exibe a lista original antes da ordenação
console.log("\n===== Lista ORIGINAL =====");
console.table(nomes);

// Ordena usando bubbleSort por ordem crescente com base no campo "nome"
console.log("\n===== ORDENANDO nomes por ordem crescente =====");
bubbleSort(nomes, "nome", true);

// Exibe a lista após a ordenação
console.log("\n===== Lista ORDENADA =====");
console.table(nomes);
