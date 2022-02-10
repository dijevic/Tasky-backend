const { response, request } = require('express')

const Usuario = require('../models/Usuario')

const { encriptar, comprobarContrasena } = require('../helpers/encriptar')
const { sendRecoverEmail, sendRegistrationEmail } = require('../helpers/sendEmail')
const { generaJWT, generarRegistrationJWT, generarJWTChangePassword } = require('../helpers/generarJwt')
const Category = require('../models/Category')
const asyncWrapper = require('../middlewares/asyncWrapper')


const renewUserToken = asyncWrapper(async (req = request, res = response) => {

    const usuario = req.usuario
    const token = await generaJWT(usuario.uuid)

    res.json({
        ok: true,
        status: 200,
        msg: 'token checked',
        id: usuario.uuid,
        name: usuario.name,
        email: usuario.email,
        token
    })
})


const loginUser = asyncWrapper(async (req = request, res = response) => {
    const { email, password } = req.body

    const test = process.env
    const usuario = await Usuario.findOne({
        where: { email }
    })

    if (!usuario) {
        return res.status(400).json({
            msg: `unsuccess, email or password wrong correo`,
            status: 400,
            ok: false

        })

    }

    const validPassword = comprobarContrasena(password, usuario.getDataValue('password'))
    if (!validPassword) {
        return res.status(400).json({
            msg: `unsuccess, email or password wrong`,
            status: 400,
            ok: false
        })
    }

    // genero JWT

    const token = await generaJWT(usuario.uuid)

    res.status(200).json({
        ok: true,
        status: 200,
        msg: 'success login',
        id: usuario.uuid,
        name: usuario.name,
        email: usuario.email,
        token,
        test
    })


}
)
const registerUser = asyncWrapper(async (req = request, res = response) => {


    let { password, email, name } = req.userData

    const data = {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        password: encriptar(password)

    }

    const user = await Usuario.create(data)
    await Category.create({ name: 'General', category_user_id: user.getDataValue('id') })

    // genero JWT 
    const token = await generaJWT(user.uuid)

    res.status(200).json({
        ok: true,
        msg: 'success register',
        token,
        name: user.name,
        email: user.email,
        id: user.uuid
    })


})


const ForgotPassword = asyncWrapper(async (req = request, res = response) => {
    const { email, password } = req.body



    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.status(404).json({
            msg: `a link was send to your email !`,
            status: 404,
            ok: false

        })

    }

    const checkPassword = comprobarContrasena(password, usuario.getDataValue('password'))

    if (checkPassword) {
        return res.json({
            ok: false,
            status: 404,
            msg: `You have to set a password different to your last password`
        })
    }



    const resetToken = await generarJWTChangePassword(usuario.uuid, password)
    // guardar token en db  

    await usuario.update({ resetToken })

    // Todo: camabiar a vriable d entorno
    const link = `https://taskys.netlify.app/auth/change-password/${resetToken}`


    sendRecoverEmail(email, link)

    res.status(200).json({
        ok: true,
        status: 200,
        msg: 'a link was send to your email !',
        link
    })


})

const changePaswword = asyncWrapper(async (req = request, res = response) => {

    const usuario = req.usuario
    const password = req.newPassword


    const data = {
        password: encriptar(password),
        resetToken: null
    }

    await usuario.update(data)
    const token = await generaJWT(usuario.uuid)

    res.status(200).json({
        ok: true,
        status: 200,
        msg: 'password has been changed successfully',
        id: usuario.uuid,
        name: usuario.name,
        token
    })

})


const registrationCheckingEmail = asyncWrapper(async (req = request, res = response) => {


    const { email, password, name } = req.body


    // genero JWT 
    const token = await generarRegistrationJWT(email, password, name)
    const link = `https://taskys.netlify.app/auth/finish-registration/${token}`
    // envio el email

    try {

        sendRegistrationEmail(email, link)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            ok: false,
            status: 404,
            msg: `something went wrong`,
        })
    }

    res.status(200).json({
        ok: true,
        status: 200,
        msg: 'an email has been send to your email !',
        link
    })


})







module.exports = {
    renewUserToken,
    loginUser,
    registerUser,
    ForgotPassword,
    changePaswword,
    registrationCheckingEmail,


}