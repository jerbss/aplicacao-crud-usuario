// Array que armazenará os usuários carregados da API
let usuarios = [];
let paginaAtual = 1;
const usuariosPorPagina = 20;
let ordemAtual = { campo: "nome", crescente: true };

async function carregarUsuarios() {
  const resposta = await fetch("/list-users/10000");
  usuarios = await resposta.json();
  atualizarPaginacao();
}

function comparaStrings(a, b, fullCompare = true) {
  const sa = a.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const sb = b.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const len = fullCompare ? Math.max(sa.length, sb.length) : 3;
  for (let i = 0; i < len; i++) {
    const c1 = sa.charCodeAt(i) || 0;
    const c2 = sb.charCodeAt(i) || 0;
    if (c1 < c2) return -1;
    if (c1 > c2) return 1;
  }
  return 0;
}

function bubbleSort(arr, key, crescente = true) {
  const tipo = typeof arr[0][key];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      let a = arr[j][key];
      let b = arr[j + 1][key];
      let comp = tipo === "string" ? comparaStrings(a, b) : a - b;
      if ((crescente && comp > 0) || (!crescente && comp < 0)) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

function ordenarTabela(campo) {
  ordemAtual = (ordemAtual.campo === campo) ?
    { campo, crescente: !ordemAtual.crescente } :
    { campo, crescente: true };
  bubbleSort(usuarios, ordemAtual.campo, ordemAtual.crescente);
  atualizarPaginacao();
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  paginaAtual = Math.max(1, Math.min(paginaAtual, totalPaginas));
  document.getElementById("paginaAtual").innerText = paginaAtual;
  document.getElementById("totalPaginas").innerText = totalPaginas;
  const inicio = (paginaAtual - 1) * usuariosPorPagina;
  const fim = inicio + usuariosPorPagina;
  renderizarTabela(usuarios.slice(inicio, fim));
}

function paginaAnterior() { paginaAtual--; atualizarPaginacao(); }
function proximaPagina() { paginaAtual++; atualizarPaginacao(); }

// FUNÇÃO ATUALIZADA
function renderizarTabela(data) {
  const tbody = document.querySelector("#tabelaUsuarios tbody");
  tbody.innerHTML = "";
  data.forEach((u) => {
    tbody.innerHTML += `
      <tr>
        <td>${u.nome}</td>
        <td>${u.idade}</td>
        <td>${u.endereco}</td>
        <td>${u.email}</td>
        <td>
          <a href="editar_usuario.html?id=${u.id}" class="botao-editar">Editar</a>
          <button onclick="removerUsuario('${u.id}')" class="botao-remover">Remover</button>
        </td>
      </tr>`;
  });
}

// NOVA FUNÇÃO
async function removerUsuario(id) {
  if (!confirm("Tem certeza que deseja remover este usuário?")) {
    return;
  }
  try {
    const resposta = await fetch(`/usuarios/${id}`, {
      method: "DELETE",
    });
    const resultado = await resposta.json();
    if (resultado.ok) {
      alert(resultado.message);
      // Remove o usuário da lista local e atualiza a tabela sem recarregar a página
      usuarios = usuarios.filter(u => u.id !== id);
      atualizarPaginacao();
    } else {
      alert("Erro ao remover usuário: " + resultado.error);
    }
  } catch (error) {
    console.error("Falha ao remover usuário:", error);
    alert("Ocorreu uma falha na comunicação com o servidor.");
  }
}

window.onload = carregarUsuarios;