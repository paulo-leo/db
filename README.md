# DB.js

O DB.js é uma biblioteca JavaScript poderosa e eficiente que simplifica a manipulação de dados JSON. Com funcionalidades semelhantes às operações de um ORM (Mapeamento Objeto-Relacional) e baseado em arrays de objetos ou listas do JavaScript, o DB.js oferece métodos encadeados para filtrar, selecionar, adicionar colunas, ordenar e agrupar dados de forma intuitiva e ágil.


## Para instalar o `DB.js`, use o seguinte comando:

```bash
npm i pl-db-js

```

Embora o DB.js não tenha sido inicialmente planejado para ser compatível com TypeScript, é possível utilizá-lo em projetos TypeScript sem problemas. No entanto, para evitar alertas no Intellisense, é recomendado adicionar a seguinte linha acima da declaração de importação do DB.js: // @ts-ignore.
   ```javascript
   // @ts-ignore
   import { db } from 'pl-db-js';
```

## Documentação

Consulte a [documentação completa](https://pauloleo.gitbook.io/db.js/) para obter detalhes sobre a utilização, métodos disponíveis e exemplos de uso do DB.js.

## Exemplo de Uso
**Filtrar Dados:**

   ```javascript
   import { db } from 'pl-db-js';

   const dados = [
    { name: "carla", idade: 27 },
    { name: "Paulo", idade: 18 },
    { name: "Leonardo", idade: 15 },
    { name: "Yago", idade: 41 },
    { name: "Maria", idade: 19 },
    { name: "Priscila", idade: 10 },
    { name: "Fernanda", idade: 20 }
   ];

   const resultadoFiltrado = db.table(dados).where('idade', '>', 18).all();

   console.table(resultadoFiltrado);
```

