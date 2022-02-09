const { response, request } = require('express')
const Usuario = require('../models/Usuario')
const { encriptar } = require('../helpers/encriptar')
const { generaJWT } = require('../helpers/generarJwt')


const getUser = async (req = request, res = response) => {

    const { id } = req.params
    try {
        const user = await Usuario.findOne({ where: { uuid: id }, include: 'tasks' })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            user
        })

    } catch (e) {
        throw new Error(e)
    }

}
const getUsers = async (req = request, res = response) => {

    try {

        const { populate } = req.query
        if (populate) {
            const { count, rows } = await Usuario.findAndCountAll({ include: 'tasks' })

            console.log(rows)
            return res.json({
                ok: true,
                status: 200,
                msg: `success`,
                total: count,
                users: rows
            })
        }
        const { count, rows } = await Usuario.findAndCountAll({ include: ['categories', 'tasks'] })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            total: count,
            users: rows
        })




    } catch (e) {
        res.json({
            ok: false,
            status: 404,
            msg: `unsuccess`,

        })

        throw new Error(e)
    }

}




const updateUser = async (req = request, res = response) => {


    try {


        let { resetToken, id, uuid, email, ...body } = req.body
        const usuario = req.usuario
        const arrBody = Object.values(body)


        if (arrBody.length === 0) {
            return res.status(400).json({
                msg: `body is required`,
                status: 404,
                ok: false

            })
        }



        if (body.password) {
            body.password = encriptar(body.password)
        }

        if (body.name) {
            body.name = body.name.toLowerCase()
        }

        if (body.password && body.password.trim() == '') {
            delete body.password
        }

        if (body.name.trim() == '') {
            delete body.name
        }



        const userUpdated = usuario.set(body)

        await userUpdated.save()
        // const token = await generaJWT(usuario.uuid)

        res.status(200).json({
            ok: true,
            status: 200,
            msg: 'user Updated !',
            id: userUpdated.uuid,
            name: userUpdated.name,
            // email: userUpdated.email,
            // token
        })

    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

const deleteUser = async (req = request, res = response) => {


    try {

        const user = req.usuario

        await user.destroy()

        res.status(200).json({
            ok: true,
            status: 200,
            msg: 'user deleted !',
        })

    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}




module.exports = {
    updateUser,
    getUsers,
    getUser,
    deleteUser
}