const Sequelize = require('sequelize')
const instancia = require('../../../banco-de-dados')
const Fornecedor = require('../Fornecedor')

const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: require('../ModeloTabelaFornecedor'),
            key: 'id'
        }
    }
}
const opcoes = {
    freezeTableName: true, //trava o nome da tabela
    tableName: 'produtos', //nome da tabela
    timestamps: true, //atribui os campos relacionados a tempo na tabela
    createdAt: 'dataCriacao', //renomeia o campo de data de criação porque vem em ingles
    updatedAt: 'dataAtualizacao', //tambem renomeia
    version: 'versao' //atribui o campo versão na tabela
}

module.exports = instancia.define('produto', colunas, opcoes)