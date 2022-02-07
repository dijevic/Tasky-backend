const jwt = require('jsonwebtoken');
const { response, request } = require('express');
const Usuario = require('../models/Usuario');
const verifyJWT = require('../helpers/verifyJWT');



const validarJwt = async (req = request, res = response, next) => {

    let token = req.header('x-token')

    if (!token) {
        return res.status(401).json({ msg: `unauthorized, missing JWT` })
    }

    try {


        const jwtVerified = await verifyJWT(token)
        console.log(jwtVerified)

        if (!jwtVerified) return res.status(404).json({ msg: ` session expired`, ok: false, status: 404 })

        const { id } = jwtVerified

        const usuario = await Usuario.findOne({ where: { uuid: id } })
        if (!usuario) {
            return res.status(401).json({ msg: `user not found`, ok: false })
        }

        // paso mi usuario a mi request y lo dejo ahi seteado
        req.usuario = usuario
        next()



    } catch (err) {
        res.status(401).json({ msg: `invalid JWT` })
    }



}
const validarResetJwt = async (req = request, res = response, next) => {

    let token = req.header('reset-token')

    if (!token) {
        return res.status(401).json({ msg: `unauthorized, missing JWT` })
    }

    try {

        const { id, password } = jwt.verify(token, process.env.PRIVATESECRETJWTKEY)

        const usuario = await Usuario.findOne({ where: { uuid: id } })

        if (!usuario) {
            return res.status(401).json({ msg: `user not found` })
        }
        if (usuario.getDataValue('resetToken') != token) {
            return res.status(401).json({ msg: `something went wrong ` })
        }

        // paso mi usuario a mi request y lo dejo ahi seteado
        req.usuario = usuario
        req.newPassword = password
        next()



    } catch (err) {
        console.log(err)
        res.status(401).json({ msg: `invalid JWT` })
    }



}
const validarRegistrationJWT = async (req = request, res = response, next) => {

    let token = req.header('registration-token')

    if (!token) {
        return res.status(401).json({ msg: `unauthorized, missing JWT` })
    }

    try {

        const { email, password, name } = jwt.verify(token, process.env.PRIVATEREGISTRATIONKEY)
        const usuario = await Usuario.findOne({
            where: { email }
        })

        if (usuario) {
            return res.status(401).json({ msg: `user Registered already`, ok: false })
        }

        // paso mi usuario a mi request y lo dejo ahi seteado
        req.userData = { email, password, name }
        next()



    } catch (err) {
        console.log(err)
        res.status(401).json({ msg: `invalid JWT` })
    }



}

module.exports = { validarJwt, validarResetJwt, validarRegistrationJWT }
