# 📘 Tutorial: Construindo uma Aplicação Web para Listagem e Ordenação de Usuários com Node.js

Este tutorial apresenta os principais conceitos utilizados no desenvolvimento de uma aplicação web baseada em Node.js e JavaScript para geração, listagem, ordenação e paginação de usuários fictícios. Este material é parte das aulas da disciplina Autoração Multimídia 2 do curso de Bacharelado em Sistemas e Mídias Digitais da Universidade Federal do Ceará, ministrada pelo Prof. Wellington W. F. Sarmento e formatado com a ajuda do chatGPT (4.1)

---

## 📌 Conceitos Abordados

### ✅ Normalização de Strings

A normalização é usada para remover acentos e padronizar letras para facilitar comparações.

Código:

```js
const sa = a
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase();
```

- "NFD" separa letras de acentos.
- A expressão /\p{Diacritic}/gu remove os acentos.
- toLowerCase() evita diferenças entre maiúsculas/minúsculas.

#### Explicando melhor

Normalizar string serve pra comparar “José” com “JOSE” e saber que é tudo igual. O método `.normalize("NFD")` separa acentos das letras, a regex remove os acentos, e `.toLowerCase()` deixa tudo em minúsculo.

**Exemplo**
“Érica” → normalize → “Érica” (o “É” vira “E” + acento separado)
Depois da regex → “Erica”
Depois do `.toLowerCase()` → “erica”
Pronto, dá pra comparar na paz!

---

### ✅ Expressões Regulares

Expressões regulares são usadas para identificar padrões de texto.

Código:

```js
.replace(/\p{Diacritic}/gu, "")
```

Remove todos os diacríticos (acentos) de uma string.

#### Explicando melhor

Expressões regulares, ou **regex**, são basicamente um “buscador universal” de padrões no texto.

O código `/\p{Diacritic}/gu` faz o seguinte:

- O `\p{Diacritic}` seleciona qualquer símbolo que seja um acento (diacrítico).
- `g` é pra fazer isso na string toda, e `u` pra funcionar certinho com Unicode (ou seja, com caracteres “estranhos” também).

**Exemplos**

- `"ação".replace(/\p{Diacritic}/gu, "")` → `"acao"`
- `"Maçã".replace(/\p{Diacritic}/gu, "")` → `"Maca"`

---

### 🌐 API RESTful

A aplicação possui uma API REST que responde à rota:

```
GET /list-users/:count?
```

- \:count é um parâmetro opcional que define quantos usuários retornar.
- O arquivo usuarios.json é lido com essa quantidade e retornado como JSON.

Código (server.js):

```js
app.get('/list-users/:count?', (req, res) => {
  let num = parseInt(req.params.count);
  ...
  res.json(lerUsuarios(num));
});
```

#### Explicando melhor

**API RESTful**
REST é um conjunto de regras (um “jeito padrão”) de criar APIs que funcionam por requisições HTTP (GET, POST, etc).
Uma API RESTful geralmente usa URLs amigáveis, sempre retorna (ou recebe) dados em JSON, e usa verbos HTTP certinho.

No exemplo, temos um endpoint que retorna uma lista de usuários conforme a quantidade pedida.

**Endpoint**
É o endereço (rota + método HTTP) de uma operação da sua API.
Exemplo: `GET /list-users/100`
Esse endpoint retorna os 100 primeiros usuários do arquivo `usuarios.json`.

---

### 🔁 Passagem de Parâmetros no Endpoint

Usamos /\:param para capturar valores diretamente da URL.

**Exemplo**

```bash
GET http://localhost:3000/list-users/200
```

O valor _200_ é capturado e atribuído à variável `req.params.count`.

#### Explicando melhor

O `/:count` lá na rota faz com que tudo que vier depois de `/list-users/` seja capturado automaticamente.

- Se você acessar `/list-users/99`, `req.params.count` será `"99"`.
- Você pode ter quantos parâmetros quiser (ex: `/api/user/:id/:acao`).
- O sinal de interrogação (`?`) indica que o parâmetro é opcional: se não mandar nada, o valor será `undefined` e seu código pode colocar um padrão (no seu backend tem um if que faz isso).

---

### 🌐 Uso do fetch()

O fetch() é uma função assíncrona usada para fazer requisições HTTP.

Código:

```js
const resposta = await fetch("http://localhost:3000/list-users/200");
usuarios = await resposta.json();
```

Se tentarmos usar fetch() sem await ou sem then, o código não espera a resposta e pode falhar.

🧨 **Exemplo com erro**

```js
const resposta = fetch("http://localhost:3000/list-users/200");
console.log(resposta.json()); // ❌ Erro: resposta ainda não chegou
```

#### Explicando melhor

O `fetch()` faz uma requisição HTTP usando JavaScript no browser. Por padrão, ele retorna uma Promise — ou seja, “promete” que um dado vai chegar… mas não chega na hora.

Como usar direito:

- Com `await` (dentro de uma função async), o JS espera a resposta antes de continuar.
- Sem `await`, você recebe uma Promise, que é tipo aquele colega que diz “pode deixar que eu entrego”... mas não entrega nunca se você não cobrar.

Resumindo:
Sempre use `await fetch()` ou `.then()` para garantir que os dados chegaram.

---

### ✅ Assíncrono com async/await

A solução correta é usar async/await:

```js
async function carregarUsuarios() {
  const resposta = await fetch("http://localhost:3000/list-users/200");
  const usuarios = await resposta.json();
}
```

#### Explicando melhor

- `async function ...` transforma sua função em “assíncrona”, permitindo usar `await` lá dentro.
- `await` pausa a execução até a Promise ser resolvida (os dados chegam), e só então segue para a próxima linha.
- Assim você evita aquele festival de `.then().then()` (callback hell).

---

### 🔄 8. Função de Ordenação e Comparação

#### Função de Comparação de Strings

```js
function comparaStrings(a, b, fullCompare = true) {
  const sa = a.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const sb = b.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  .
  .
  .
}
```

Permite ordenar por campos como nome (String) ou idade (Number).

#### Explicando melhor

Aqui, normaliza as duas strings e compara caractere a caractere, podendo comparar só os 3 primeiros (tipo "ordem de telefone"!), ou tudo.

A função retorna -1, 0 ou 1, igual ao método `.sort()` do JS.

---

## Bubble Sort Adaptado

```js
function bubbleSort(arr, key, crescente = true) {
  ...
}
```

Permite ordenar por campos como nome (string) ou idade (número).

---

### Passo a passo do algoritmo

_Vetor inicial:_ `["bba", "abc", "bac", "bca", "aaa"]`

_🔄 Primeira passada (i = 0)_
`compara(bba, abc) → "bba" > "abc" → troca`
→ \["abc", "bba", "bac", "bca", "aaa"]

`compara(bba, bac) → "bba" > "bac" → troca`
→ \["abc", "bac", "bba", "bca", "aaa"]

`compara(bba, bca) → "bba" < "bca" → não troca`

`compara(bca, aaa) → "bca" > "aaa" → troca`
→ \["abc", "bac", "bba", "aaa", "bca"]

_🔄 Segunda passada (i = 1)_
`compara(abc, bac) → "abc" < "bac" → não troca`

`compara(bac, bba) → "bac" < "bba" → não troca`

`compara(bba, aaa) → "bba" > "aaa" → troca`
→ \["abc", "bac", "aaa", "bba", "bca"]

_🔄 Terceira passada (i = 2)_
`compara(bac, aaa) → "bac" > "aaa" → troca`
→ \["abc", "aaa", "bac", "bba", "bca"]

_🔄 Quarta passada (i = 3)_
`compara(abc, aaa) → "abc" > "aaa" → troca`
→ \["aaa", "abc", "bac", "bba", "bca"]

---

## Função de Comparação de strings

### Compara os três primeiros caracteres de duas strings.

```Javascript
function compara3Primeiros(str1, str2) {
  str1 = String(str1).slice(0, 3).toLowerCase();
  str2 = String(str2).slice(0, 3).toLowerCase();

  for (let i = 0; i < 3; i++) {
    const char1 = str1.charCodeAt(i) || 0; // Se não tiver char, vira 0
    const char2 = str2.charCodeAt(i) || 0;

    if (char1 < char2) return -1;
    if (char1 > char2) return 1;
  }

  return 0;
}
```

🚀 **Objetivo**
Criar uma função chamada compara3Primeiros(str1, str2) que:

Compara os três primeiros caracteres de duas strings.

Retorna:

-1 se str1 < str2
1 se str1 > str2
0 se forem iguais

🧠 **Lógica**
Pegamos os três primeiros caracteres com slice(0, 3) (ou menos se a string for menor que isso).

Comparamos letra a letra (como no dicionário).

Se empatar tudo, retorna 0.

_O que tá rolando aqui: `str1.charCodeAt(i):`?_
Pega o código numérico Unicode do caractere na posição i da string 1.
Ex: "a".charCodeAt(0) → 97, "b".charCodeAt(0) → 98

`|| 0`:
Caso a string tenha menos de 3 caracteres, charCodeAt(i) pode retornar NaN.
`|| 0` evita erro e força a comparar com 0, que representa o "vazio".

O `for`:
Compara o caractere na posição 0, depois 1, depois 2.
Assim, a gente faz uma ordem lexicográfica, tipo dicionário.

_As três primeiras letras_

```bash
str1: "bat" → códigos [98, 97, 116]
str2: "ban" → códigos [98, 97, 110]
```

_Comparação_

- b vs b → mesmo código → segue
- a vs a → mesmo código → segue
- t vs n → 116 > 110 → retorna 1

Portanto: "bat" vem depois de "ban".

**IMPORTANTE**
Criei uma rotina que permite testar este código e coloquei dentro deste repositório. Para testá-la, basta:

```bash
node teste-ordena-bubblesort.js
```

Também criei uma rotina que permite ver o método de comparação passo a passo:

```bash
node teste-ordena-bubblesort-passo-a-passo.js
```

---

### Compara as strings completas

```Javascript
function comparaStrings(str1, str2) {
  // Normaliza (sem acento) e converte para minúsculo
  str1 = String(str1).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  str2 = String(str2).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  const len = Math.max(str1.length, str2.length);

  for (let i = 0; i < len; i++) {
    const c1 = str1.charCodeAt(i) || 0; // 0 se acabou a string
    const c2 = str2.charCodeAt(i) || 0;

    if (c1 < c2) return -1;
    if (c1 > c2) return 1;
  }

  return 0; // Strings idênticas
}
```

**IMPORTANTE**
Criei uma rotina que permite testar este código e coloquei dentro deste repositório. Para testá-la, basta:

```bash
node teste-compara-strings.js
```

Também criei uma rotina que permite ver o método de comparação passo a passo:

```bash
node teste-compara-strings-passo-a-passo.js
```

---

## 📑 Paginação dos Dados

### Explicando melhor

A paginação é o truque de dividir a lista gigante de usuários em "fatias" menores para exibir só um pedaço por vez, melhorando a performance e a experiência do usuário.

#### Como funciona no seu sistema

a) **Variáveis de controle:**

- `let paginaAtual = 1;` – Página sendo exibida.
- `const usuariosPorPagina = 20;` – Quantos usuários aparecem por página.

b) **Função de Paginação:**

- A função `atualizarPaginacao()` calcula quantas páginas são necessárias, baseado na quantidade total de usuários e quantos aparecem por página:

  ```js
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  ```

- Garante que o número da página não ultrapasse os limites válidos:

  ```js
  paginaAtual = Math.max(1, Math.min(paginaAtual, totalPaginas));
  ```

  As funções `NMath.max()`e `Math.min()`retornam o maior e o menor valor dos parâmetros passados, respectivamente.

c) **Cálculo dos índices:**

- O início e fim da fatia exibida:

  ```js
  const inicio = (paginaAtual - 1) * usuariosPorPagina;
  const fim = inicio + usuariosPorPagina;
  ```

  **Exemplo**

  - Se paginaAtual = -3 => resultado: 1
  - Se paginaAtual = 99 e totalPaginas = 10 => resultado: 10
  - Se paginaAtual = 5 e totalPaginas = 10 => resultado: 5 (dentro do normal)

d) **Renderização:**

- Só os usuários daquela fatia são exibidos:

  ```js
  renderizarTabela(usuarios.slice(inicio, fim));
  ```

- Exemplo: **página 2**, **início = 20**, **fim = 40 (usuários de 21 a 40)**.

e) **Botões de navegação:**

- Chamam `paginaAnterior()` e `proximaPagina()` para trocar de página, sempre atualizando a visualização.
- Os botões mudam a variável `paginaAtual` e chamam `atualizarPaginacao()` de novo.

f) **Interface:**

- O número da página e o total aparecem na tela para o usuário:
  `Página 2 de 10`

---

## Código `script.js` comentado

O código completo do Javascript usado `index.html` deste projeto está aqui:

[script.js](/script.js)
