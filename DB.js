/*
Descrição: O DB.js é uma biblioteca JavaScript poderosa e eficiente que simplifica a manipulação de dados JSON. Com funcionalidades semelhantes às operações de um ORM (Mapeamento Objeto-Relacional) e baseado em arrays de objetos ou listas do JavaScript, o DB.js oferece métodos encadeados para filtrar, selecionar, adicionar colunas, ordenar e agrupar dados de forma intuitiva e ágil.
*****************************************************************************
Autor: Paulo Leonardo da Silva Cassimiro
Licença: MIT
Doc: https://pauloleo.gitbook.io/db.js/
Versão:1.0.0
*/
const Model = function (array = [], primaryKey = 'id') {

    this.primaryKey = primaryKey;

    try {
        if (!Array.isArray(array))
            array = JSON.parse(array);
    } catch (error) {
        console.log("Não foi possível realizar a conversão dos dados", error);
    }
    array = this.addPrimaryKeyIfExists(array);
    this.array = array;
    this.origin = array;
    this.select;
    this.limit;
    this.groupBy;
};


Model.prototype.isIndexArray = function (array) {
    let index = array[0] ?? false;
    if (typeof index === 'string' || typeof index === 'integer') return true;
};

/*
  Adciona o ID automaticamente caso não exista
*/
Model.prototype.addPrimaryKeyIfExists = function (arr) {
    let data = [];

    if (this.isIndexArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            let value = {};
            value[this.primaryKey] = (i + 1);
            value['value'] = arr[i];
            data.push(value);
        }

    } else {

        let existsId = (arr.length >= 1) ? (!arr[0].hasOwnProperty(this.primaryKey)) : false;

        if (existsId) {

            for (let i = 0; i < arr.length; i++) {
                let value = arr[i];
                value[this.primaryKey] = (i + 1);
                data.push(value);
            }
        } else {
            data = arr;
        }
    }
    return data;
};

/*
  Métodos para manipular a estrutura
*/
//Define uma nova coluna
Model.prototype.addCol = function (name, value = null) {
    let rows = this.array;
    let objs = [];
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        row[name] = (typeof value === 'function') ? value(row, rows) : value;
        objs.push(row);
    }
    this.array = objs;
    return this;
};

Model.prototype.addRow = function (num = 1, data) {

    let auto = false;
    let current = (this.array.length >= 1) ? this.array[0] : {};
    if (!data) { auto = true; } else {
        if (data.hasOwnProperty(this.primaryKey)) {
            auto = false;
        }
    }

    data = data ? data : current;

    let rows = this.array;
    let size = rows.length;

    for (let i = 0; i < num; i++) {
        let newRow = { ...data };

        if (auto) {
            let id = `${size + i + 1}`;
            newRow[this.primaryKey] = parseInt(id);
        }

        rows.push(newRow);
    }

    this.array = rows;
    return this;
};


Model.prototype.table = function (value, primaryKey = 'id') {
    let obj = new Model(value, primaryKey);
    return obj;
};

Model.prototype.convertIfNumber = function (value) {

    if (!isNaN(value)) {
        value = Number(value);
    } else {
        value = value.toLowerCase();
    }
    return value;
};
/*
Aplica o filtro de forma recursiva 
*/
Model.prototype.filter = function (key, op, val) {
    let filter = [];
    let origin = [];
    let arr = this.origin;
    for (let i = 0; i < arr.length; i++) {
        origin.push(arr[i]);
        let value = arr[i][key];
        let data = arr[i];


        if (['null', '!null', 'empty'].includes(op)) {
            val = '0';
        } else {
            let test = (val == undefined);
            if (test) {
                val = op;
                op = '=';
            }
            val = Array.isArray(val) ? val : this.convertIfNumber(val);
            value = this.convertIfNumber(value);
        }

        switch (op) {
            case '>':
                if (parseFloat(value) > parseFloat(val)) {
                    filter.push(data);
                }
                break;
            case '<':
                if (parseFloat(value) < parseFloat(val)) {
                    filter.push(data);
                }
                break;
            case '>=':
                if (parseFloat(value) >= parseFloat(val)) {
                    filter.push(data);
                }
                break;
            case '<=':
                if (parseFloat(value) <= parseFloat(val)) {
                    filter.push(data);
                }
                break;
            case 'c':
                if (value.indexOf(val) !== -1) {
                    filter.push(data);
                }
                break;
            case 'c*':
                if (value.startsWith(val)) {
                    filter.push(data);
                }
                break;
            case '*c':
                if (value.endsWith(val)) {
                    filter.push(data);
                }
                break;
            case '=':
                if (value == val) {
                    filter.push(data);
                }
                break;
            case '!=':
                if (value != val) {
                    filter.push(data);
                }
                break;
            case 'null':
                if (value == null || value == undefined) {
                    filter.push(data);
                }
                break;
            case '!null':
                if (value != null || value != undefined) {
                    filter.push(data);
                }
                break;
            case 'empty':
                if (value.length > 1) value = value.trim();
                if (value == '') {
                    filter.push(data);
                }
                break;
            case 'in':
                let encontrado1 = false;
                for (let v = 0; v < val.length; v++) {
                    let searchValue = `${val[v]}`;
                    if (value == searchValue) {
                        encontrado1 = true;
                        break;
                    }
                }

                if (encontrado1) {
                    filter.push(data);
                }
                break;
            case '!in':
                let encontrado = false;
                for (let v = 0; v < val.length; v++) {
                    let searchValue = `${val[v]}`;
                    if (value == searchValue) {
                        encontrado = true;
                        break;
                    }
                }

                if (!encontrado) {
                    filter.push(data);
                }
                break;
        }
    }
    this.array = filter;
    return this;
};

Model.prototype.where = function (keyName, keyOp, keyValue) {
    let filters = [];

    if (Array.isArray(keyName)) {
        filters = keyName;
    } else {
        filters.push([keyName, keyOp, keyValue]);
    }

    for (let i = 0; i < filters.length; i++) {
        let name = filters[i][0];
        let op = filters[i][1];
        let value = filters[i][2] ?? false;

        if (['null', '!null', 'empty'].includes(op)) {
            value = '0';
        }

        if (!value) {
            value = op;
            op = '=';
        }

        if (op == ':') {
            value = `${value}`;
            let bet = value.split('|');
            let bet1 = bet[0];
            let bet2 = bet[1] ?? bet1;
            this.filter(name, '>=', bet1);
            this.filter(name, '<=', bet2);
        }
        else {
            this.filter(name, op, value);
        }
    }
    return this;
};
/*
  Adiciona varias seleções
*/
Model.prototype.select = function (selects) {
    if (!Array.isArray(selects)) {
        selects = selects.split(',');
    }
    this.select = selects;
    return this;
};

/*
  Adiciona uma seleção
*/
Model.prototype.addSelect = function (name) {
    let cols = this.select;
    cols.push(name);
    this.select = cols;
    return this;
};
/*
  Função auxiliadora para seleção
*/
Model.prototype.getSelects = function () {
    let data = this.array;
    let newData = [];
    let select = this.select;

    if (!Array.isArray(select)) {
        return data;
    }

    for (let i = 0; i < data.length; i++) {
        let values = {};
        for (let k = 0; k < select.length; k++) {
            let key = select[k];


            if (Array.isArray(key)) {

                let k1 = key[0];
                let func = key[1] ?? null;
                let as = k1.split(':');
                k1 = as[0];
                let name = as[1] ?? k1;

                if (typeof func === 'function') {
                    values[name] = func(data[i][k1]);
                } else {

                    values[name] = func;
                }

            } else {
                let as = key.split(':');
                key = as[0];
                let name = as[1] ?? key;
                values[name] = data[i][key];
            }
        }
        newData.push(values);
    }

    return newData;
};

Model.prototype.limit = function (value = 10) {
    this.limit = value;
    return this;
};

Model.prototype.groupBy = function (value) {
    value = Array.isArray(value) ? value : value.split(',');
    this.groupBy = value;
    return this;
};

Model.prototype.get = function () {
    let r = this.getSelects();
    let results = [];
    if (typeof this.limit === 'number') {
        let limit = parseInt(this.limit);
        let total = r.length;

        limit = (total < limit) ? total : limit;

        for (let i = 0; i < limit; i++) {
            results.push(r[i]);
        }
    } else {
        results = r;
    }

    if (Array.isArray(this.groupBy)) {
        results = this.groupByMultipleKeys(results, this.groupBy);
    }

    return results;
};

Model.prototype.exists = function () {
    let results = this.get();
    return (results.length >= 1);
};

Model.prototype.call = function (func) {
    let results = this.get();
    let check = (results.length >= 1);
    if (check) {
        if (typeof func === 'function')
            func(results, this.origin);
    }
};

Model.prototype.has = function () {
    let results = this.get();
    return (results.length >= 1) ? results : false;
};

Model.prototype.except = function (excepts) {
    excepts = Array.isArray(excepts) ? excepts : excepts.split(',');
    let results = [...this.get()];
    for (let i = 0; i < results.length; i++) {
        for (let e = 0; e < excepts.length; e++) {
            if (results[i].hasOwnProperty(excepts[e])) {
                delete (results[i][excepts[e]])
            }
        }
    }
    return results;
};

Model.prototype.only = function (onlys) {
    onlys = Array.isArray(onlys) ? onlys : onlys.split(',');
    let arr = this.get();
    let results = [];

    for (let i = 0; i < arr.length; i++) {
        let value = {};
        for (let e = 0; e < onlys.length; e++) {
            if (arr[i].hasOwnProperty(onlys[e])) {
                value[onlys[e]] = arr[i][onlys[e]];
            }
        }
        results.push(value);
    }
    return results;
};


Model.prototype.getString = function () {
    return JSON.stringify(this.get());
};

Model.prototype.groupByMultipleKeys = function (array, chaves) {
    return array.reduce((agrupado, obj) => {
        const compositeKey = chaves.map(chave => obj[chave]).join('-');

        if (!agrupado[compositeKey]) {
            agrupado[compositeKey] = [];
        }

        agrupado[compositeKey].push(obj);
        return agrupado;
    }, {});
};

Model.prototype.orderBy = function (chaves, ordem) {
    chaves = Array.isArray(chaves) ? chaves : chaves.split(',');
    let arrayDeObjetos = this.array;
    arrayDeObjetos = arrayDeObjetos.sort((objeto1, objeto2) => {
        let valorChavesObjeto1 = chaves.map(chave => objeto1[chave]).join('');
        let valorChavesObjeto2 = chaves.map(chave => objeto2[chave]).join('');

        let ordenacao = 1;

        if (ordem === 'desc') {
            ordenacao = -1;
        }

        if (valorChavesObjeto1 < valorChavesObjeto2) {
            return -1 * ordenacao; decrescente
        } else if (valorChavesObjeto1 > valorChavesObjeto2) {
            return 1 * ordenacao;
        } else {
            return 0;
        }
    });
    this.array = arrayDeObjetos;
    return this;
};


Model.prototype.pluck = function (name, origin = false) {
    let rows = origin ? this.array : this.get();
    let array = [];
    for (let i = 0; i < rows.length; i++) {
        let value = rows[i][name] ?? null;
        array.push(value);
    }
    return array;
};

Model.prototype.pluckString = function (name, origin = false) {
    return JSON.stringify(this.pluck(name, origin));
};

Model.prototype.first = function () {
    let r = this.get();
    return r[0] ?? {};
};


Model.prototype.find = function (value) {
    let key = this.primaryKey;
    return this.where(key, value).first();
};
/*
Métodos para cálculos
*/
Model.prototype.count = function (name = '*') {
    let array = this.array;
    if (name != '*' && name) {
        array = array.filter(objeto => objeto[name] !== null && objeto[name] !== undefined);
    }
    return (array.length);
};

Model.prototype.total = function (name) {
    let total = 0;
    let array = this.pluck(name);
    for (let value of array) {
        if (!isNaN(value)) {
            total++;
        }
    }
    return total;
};

Model.prototype.sum = function (name) {
    let total = 0;
    let array = this.pluck(name);
    for (let value of array) {
        if (!isNaN(value)) {
            total += parseFloat(value);
        }
    }
    return total;
};

Model.prototype.numbers = function (name) {
    let array = this.pluck(name);
    let numbers = [];
    for (let value of array) {
        if (!isNaN(value)) {
            numbers.push(parseFloat(value));
        }
    }
    return numbers;
};

Model.prototype.max = function (name) {
    let numbers = this.numbers(name);
    let max = Math.max(...numbers);
    return max;
};

Model.prototype.min = function (name) {
    let numbers = this.numbers(name);
    let min = Math.min(...numbers);
    return min;
};

Model.prototype.avg = function (name) {
    let total = this.total(name);
    let sum = this.sum(name);
    return (sum / total);
};

Model.prototype.delete = function () {
    let key = this.primaryKey;
    let data = [];
    let origin = this.origin;
    let searchs = this.array;

    for (let i = 0; i < origin.length; i++) {
        let row = origin[i];
        let id = this.convertIfNumber(row[key]);
        let search = searchs.find(search => this.convertIfNumber(search[key]) == id);
        if (!search) {
            data.push(row);
        }
    }
    return data;
};

Model.prototype.update = function (values) {
    let key = this.primaryKey;
    let data = [];
    let origin = this.origin;
    let searchs = this.array;

    for (let i = 0; i < origin.length; i++) {
        let row = origin[i];
        let id = this.convertIfNumber(row[key]);
        let search = searchs.find(search => this.convertIfNumber(search[key]) == id);
        if (search) {
            for (let name in values) {
                if (row.hasOwnProperty(name)) {
                    let newValue = values[name];
                    if (typeof newValue === 'function') {
                        newValue = newValue(row, origin);
                    }
                    row[name] = newValue;
                }
            }
        }
        data.push(row);
    }
    return data;
};

const db = new Model;
const model = Model;
export { model, db };