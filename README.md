# DB.js

O DB.js é uma biblioteca JavaScript poderosa e eficiente que simplifica a manipulação de dados JSON. Com funcionalidades semelhantes às operações de um ORM (Mapeamento Objeto-Relacional) e baseado em arrays de objetos ou listas do JavaScript, o DB.js oferece métodos encadeados para filtrar, selecionar, adicionar colunas, ordenar e agrupar dados de forma intuitiva e ágil.

## Exemplos de Uso

1. **Filtrar Dados:**

   ```javascript
   const resultadoFiltrado = db.table(dados).where('idade', '>', 18).get();
