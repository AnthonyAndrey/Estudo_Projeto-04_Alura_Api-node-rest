const roteador = require('express').Router({ mergeParams: true }) //mergeParams, pega os parametros da rota anterior
const Tabela = require('./TabelaProdutos')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end();
})

roteador.get('/', async(requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.fornecedor.id) //aqui a gente esta pegando o idFonecedor da URL para pegar todos produtos relacionados ao fornecedor 
    const serializador = new Serializador(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async(requisicao, resposta, proximo) => {
    try {
        const idFornecedor = requisicao.fornecedor.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new Serializador(
                resposta.getHeader('Content-Type')
            )
            //passando para o cabeçalho informações detalhadas da ação
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        resposta.set('Location', `/api/fonecedores/${produto.fornecedor}/produtos/${produto.id}`)

        resposta.status(201)
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, PUT')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end();
})

roteador.delete('/:id', async(requisicao, resposta) => {
    const dados = {
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id,
    }
    const produto = new Produto(dados)
    await produto.apagar()
    resposta.status(204)
    resposta.end()
})

roteador.get('/:id', async(requisicao, resposta, proximo) => {
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id,
        }
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type'), ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

// serve pra quando a gente chama so o head no metodo http
roteador.head('/:id', async(requisicao, resposta, proximo) => {
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id,
        }
        const produto = new Produto(dados)
        await produto.carregar()
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        resposta.status(200)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async(requisicao, resposta, proximo) => {

    try {
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        })
        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id/diminuir-estoque', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end();
})

//rota para diminuir o estoque
roteador.post('/:id/diminuir-estoque', async(requisicao, resposta, proximo) => {

    try {
        const produto = new Produto({
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        })
        await produto.carregar()
        produto.estoque = produto.estoque - requisicao.body.quantidade //aqui estamos subtraindo o que venda requisição com o a quantidade do banco
        await produto.diminuirEstoque()
        await produto.carregar()
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

module.exports = roteador