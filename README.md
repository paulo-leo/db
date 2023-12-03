# DB.js

O DB.js é uma biblioteca JavaScript poderosa e eficiente que simplifica a manipulação de dados JSON. Com funcionalidades semelhantes às operações de um ORM (Mapeamento Objeto-Relacional) e baseado em arrays de objetos ou listas do JavaScript, o DB.js oferece métodos encadeados para filtrar, selecionar, adicionar colunas, ordenar e agrupar dados de forma intuitiva e ágil.


## Para instalar o `DB.js`, use o seguinte comando:

```bash
npm i pl-db-js

```

## Documentação

Consulte a [documentação completa](https://pauloleo.gitbook.io/db.js/) para obter detalhes sobre a utilização, métodos disponíveis e exemplos de uso do DB.js.

## Exemplo de Uso
**Filtrar Dados:**

   ```javascript
   const dados = [
    { name: "Paulo", idade: 18 },
    { name: "Leonardo", idade: 15 },
    { name: "Maria", idade: 19 },
    { name: "Priscila", idade: 10 }
   ];

   const resultadoFiltrado = db.table(dados).where('idade', '>', 18).get();

   console.table(resultadoFiltrado);
```

