/**
 * Módulo para leitura e escrita de dados de usuários em um arquivo JSON com bloqueio de arquivo.
 * Este módulo garante que o acesso concorrente ao arquivo de dados de usuário seja gerenciado de forma segura.
 * Fornece funções para ler a lista de usuários e salvar uma nova lista de usuários,
 * adquirindo um bloqueio de arquivo para evitar condições de corrida.
 */

const fs = require("fs/promises");
const path = require("path");
const lockfile = require("proper-lockfile");

const filePath = path.join(__dirname, "usuarios.json");

/**
 * Fornece acesso exclusivo a um recurso adquirindo um bloqueio de arquivo antes de executar a função fornecida.
 * Garante que o bloqueio seja sempre liberado após a execução da função, independente de sucesso ou falha.
 *
 * @param {Function} fn - Função assíncrona a ser executada enquanto o bloqueio está ativo.
 * @returns {Promise<*>} O resultado da função executada.
 */
async function comLock(fn) {
  let release;
  try {
    // tenta algumas vezes antes de falhar, evita deadlocks em picos de acesso
    release = await lockfile.lock(filePath, {
      retries: { retries: 5, factor: 2, minTimeout: 50, maxTimeout: 1000 },
      // stale determina em ms quanto tempo depois do lock ser considerado 'velho' e liberado automaticamente
      stale: 5000,
    });
    return await fn();
  } finally {
    if (release) {
      try {
        await release();
      } catch (err) {
        console.error("Erro ao liberar lock de usuarios.json:", err);
      }
    }
  }
}

/**
 * Lê e retorna a lista de usuários do arquivo usuarios.json.
 * Garante acesso concorrente seguro adquirindo um bloqueio de arquivo durante a operação de leitura.
 *
 * @async
 * @function lerUsuarios
 * @returns {Promise<Array<Object>>} Array de objetos de usuário parseados do JSON,
 *                                   ou array vazio em caso de erro.
 */
async function lerUsuarios() {
  return comLock(async () => {
    try {
      const dados = await fs.readFile(filePath, "utf-8");
      console.log("Lendo usuarios.json...");
      const texto = dados.trim();
      if (!texto) {
        console.warn("usuarios.json está vazio. Retornando array vazio.");
        return [];
      }
      const arr = JSON.parse(texto);
      console.log(`Total de usuários lidos: ${arr.length}`);
      return arr;
    } catch (err) {
      console.error("Erro ao ler usuarios.json:", err);
      return [];
    }
  });
}

/**
 * Salva a lista de usuários fornecida no arquivo usuarios.json.
 * Garante acesso concorrente seguro adquirindo um bloqueio de arquivo durante a operação de escrita.
 *
 * @async
 * @function salvarUsuarios
 * @param {Array<Object>} usuarios - Array de objetos de usuário a ser salvo no arquivo JSON.
 * @returns {Promise<void>}         Promise resolvida quando a escrita for concluída
 *                                   (ou rejeitada em caso de erro).
 */
async function salvarUsuarios(usuarios) {
  return comLock(async () => {
    try {
      const json = JSON.stringify(usuarios, null, 2);
      await fs.writeFile(filePath, json, "utf-8");
      console.log("usuarios.json atualizado com sucesso.");
    } catch (err) {
      console.error("Erro ao salvar usuarios.json:", err);
    }
  });
}

module.exports = {
  lerUsuarios,
  salvarUsuarios,
};
