class NaoEncontrado extends Error { //a classe NaoEncontrado pega as proriedades da classe Error
    constructor(nome) {
        super(`${nome} não foi encontrado!`) //esse método vai chamar o contructor da classe Error 
        this.name = 'NaoEncontrado' // altera o nome interno da classe
        this.idErro = 0
    }
}

module.exports = NaoEncontrado