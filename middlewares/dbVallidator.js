const Category = require("../models/Category")
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
const validateCategory = async (name) => {
    const existeCategory = await Category.findOne({
        where: { name }
    })

    if (existeCategory) {
        throw new Error(`category already exist`)
    }

}

module.exports = {
    validEmail,
    notValidEmail,
    validateCategory
}