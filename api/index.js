const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const config = require('config');
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => { //middlewares é criada para executar funções entre a requisição e a resposta do servidor 
        let formatoRequisitado = requisicao.header('Accept') // aqui esta pegando formato que é aceito pelo cliente

        if (formatoRequisitado.includes('*/*')) {
            formatoRequisitado = 'application/json'
        }

        if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
            resposta.status(406)
            resposta.end()
            return
        }
        resposta.setHeader('Content-Type', formatoRequisitado)
        proximo()
    })
    // esse codigo serve para que coloquemos um domínio que e seja liberado a acessar a api e tem o nome de CORS
app.use((requisicao, resposta, proximo) => {
    resposta.set('Access-Control-Allow-Origin', '*') //o asterisco significa que podemos acessar a api de qualquer site
        // resposta.set('Access-Control-Allow-Origin', 'http://localhost:3000') //quando a gente coloca o dominio, não pode ter barra no final
    proximo()
})

const roteador = require('./rotas/fornecedores');
app.use('/api/fornecedores', roteador)

const roteadorV2 = require('./rotas/fornecedores/rotas.v2');
app.use('/api/v2/fornecedores', roteadorV2)

app.use((erro, requisicao, resposta, proximo) => {
    let status = 500
    if (erro instanceof NaoEncontrado) {
        status = 404
    }
    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }
    if (erro instanceof ValorNaoSuportado) {
        status = 406
    }
    const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
    )
    resposta.status(status)
    resposta.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => {
    console.log('a api esta funcionando');
})