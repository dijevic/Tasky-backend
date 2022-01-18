const Usuario = require("../models/Usuario")

const validEmail = async (email) => {


    const existeEmail = await Usuario.findOne({
        where: { email }
    })

    if (existeEmail) {
        throw new Error(`E-mail already in use`)
    }

}

const notValidEmail = async (email) => {
    const existeEmail = await Usuario.findOne({
        where: { email }
    })

    if (!existeEmail) {
        throw new Error(`something goes wrong`)
    }

}

module.exports = {
    validEmail,
    notValidEmail
}