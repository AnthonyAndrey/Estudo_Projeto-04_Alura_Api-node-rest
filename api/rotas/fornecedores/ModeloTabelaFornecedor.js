const Sequelize = require("sequelize")
const instancia = require("../../banco-de-dados")

const colunas = { //cria colunas
    empresa: { //coluna
        type: Sequelize.STRING, //tipo de valor do campo
        allowNull: false // não pode ser nula por causa do false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'), //numera o que a gente pode aceitar nesse tipo de valor
        allowNull: false
    }
}

const opcoes = {
    freezeTableName: true, //trava o nome da tabela
    tableName: 'fornecedores', //nome da tabela
    timestamps: true, //atribui os campos relacionados a tempo na tabela
    createdAt: 'dataCriacao', //renomeia o campo de data de criação porque vem em ingles
    updatedAt: 'dataAtualizacao', //tambem renomeia
    version: 'versao' //atribui o campo versão na tabela
}
module.exports = instancia.define(
    'fornecedor', //nome da tabela no código
    colunas, opcoes);