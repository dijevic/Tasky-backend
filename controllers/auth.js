const { response, request } = require('express')

const Usuario = require('../models/Usuario')

const { encriptar, comprobarContrasena } = require('../helpers/encriptar')
const { sendRecoverEmail, sendRegistrationEmail } = require('../helpers/sendEmail')
const { generaJWT, generarRegistrationJWT, generarJWTChangePassword } = require('../helpers/generarJwt')
const Category = require('../models/Category')


const renewUserToken = async (req = request, res = response) => {

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
}


const loginUser = async (req = request, res = response) => {
    const { email, password } = req.body

    try {

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


        // getData value to get the real db value(in this cse the password)

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
            token
        })

    } catch (e) {
        console.log(e)
        // throw new Error(e)
    }
}

const registerUser = async (req = request, res = response) => {


    try {
        let { password, email, name } = req.userData


        const data = {
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            password: encriptar(password)

        }

        const user = await Usuario.create(data)
        const category = await Category.create({ name: 'General', category_user_id: user.getDataValue('id') })


        // genero JWT 
        const token = await generaJWT(user.uuid)

        res.status(200).json({
            ok: true,
            msg: 'success register',
            token,
            name: user.name,
            email: user.email,
            id: user.uuid,
            category
        })

    } catch (e) {
        console.log(`error 500`)
        throw new Error(e)
    }
}


const ForgotPassword = async (req = request, res = response) => {
    const { email, password } = req.body

    try {


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
        const link = `http://localhost:3000/auth/change-password/${resetToken}`


        // no olvidar enviar

        sendRecoverEmail(email, link)



        res.status(200).json({
            ok: true,
            status: 200,
            msg: 'a link was send to your email !',
            link,
            resetToken
        })

    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

const changePaswword = async (req = request, res = response) => {

    try {

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

    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}


const registrationCheckingEmail = async (req = request, res = response) => {


    try {
        const { email, password, name } = req.body

        // genero JWT 
        const token = await generarRegistrationJWT(email, password, name)
        const link = `http://localhost:3000/auth/finish-registration/${token}`
        // envio el email

        // try {

        //     sendRegistrationEmail(email, link)

        // } catch (e) {
        //     console.log(e)
        //     return res.status(404).json({
        //         ok: false,
        //         status: 404,
        //         msg: `something went wrong`,
        //     })
        // }

        res.status(200).json({
            ok: true,
            status: 200,
            msg: 'an email has been send to your email !',
            link
        })

    } catch (e) {
        console.log(`error 500`)
        throw new Error(e)
    }
}








module.exports = {
    renewUserToken,
    loginUser,
    registerUser,
    ForgotPassword,
    changePaswword,
    registrationCheckingEmail,


}