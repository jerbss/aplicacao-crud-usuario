// teste-comparacao-strings.js

/**
 * Função para comparar strings com normalização de acentos e comparação sem diferenciar maiúsculas/minúsculas.
 *
 * @param {string} a - Primeira string a ser comparada
 * @param {string} b - Segunda string a ser comparada
 * @param {boolean} fullCompare - Se true, compara todos os caracteres; se false, compara apenas os 3 primeiros
 * @returns {number} - Retorna -1 se a < b, 1 se a > b, ou 0 se forem equivalentes
 */
function comparaStrings(a, b, fullCompare = true) {
  // Normaliza as strings:
  // - .normalize("NFD") separa letras de acentos
  // - .replace(...) remove os acentos (usando classe Unicode para diacríticos)
  // - .toLowerCase() converte tudo para minúsculas
  const sa = a
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  const sb = b
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  // Define quantos caracteres serão comparados:
  // Se fullCompare for true, compara até o maior comprimento das strings;
  // caso contrário, compara só os 3 primeiros caracteres
  const len = fullCompare ? Math.max(sa.length, sb.length) : 3;

  // Laço de comparação caractere por caractere
  for (let i = 0; i < len; i++) {
    const c1 = sa.charCodeAt(i) || 0; // Obtém o código Unicode do caractere em 'a' (ou 0 se não existir)
    const c2 = sb.charCodeAt(i) || 0; // Idem para 'b'

    // Se os códigos forem diferentes, determina a ordem
    if (c1 < c2) return -1;
    if (c1 > c2) return 1;
  }

  // Se todos os caracteres comparados forem iguais, retorna 0
  return 0;
}

// ============================================================================
// BLOCOS DE TESTES COM VÁRIOS PARES DE STRINGS PARA COMPARAÇÃO
// ============================================================================

// Lista de exemplos para testar a função comparaStrings
const exemplos = [
  ["é", "e"], // com acento vs sem acento
  ["Álvaro", "ana"], // maiúsculas, acento e ordem alfabética
  ["João", "joao"], // til sendo ignorado pela normalização
  ["caio", "Caio"], // mesma palavra com letras diferentes
  ["joão", "José"], // nomes próximos
  ["banana", "Banana"], // diferença apenas de maiúscula
  ["Ação", "acordo"], // palavras com acento no meio
];

// Cabeçalho simpático para o console
console.log("🧪 Teste de comparação de strings:\n");

// Loop que percorre os pares da lista de exemplos
for (const [a, b] of exemplos) {
  const r = comparaStrings(a, b); // Resultado da comparação (-1, 0, 1)

  // Constrói a mensagem com base no valor retornado
  const resultado =
    r < 0 ? `"${a}" < "${b}"` : r > 0 ? `"${a}" > "${b}"` : `"${a}" == "${b}"`;

  // Exibe o resultado da comparação
  console.log(`Comparando "${a}" com "${b}" → ${resultado}`);
}
