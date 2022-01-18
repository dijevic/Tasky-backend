const JWT = require('jsonwebtoken')

const generaJWT = (id) => {
    return new Promise((resolve, reject) => {
        const payload = { id }

        JWT.sign(payload, process.env.PRIVATESECRETJWTKEY, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) {
                reject(`no se puede generar el token`)
            } else {
                resolve(token)
            }
        })
    })
}

const generarRegistrationJWT = (email, password, name) => {
    return new Promise((resolve, reject) => {
        const payload = { email, password, name }

        JWT.sign(payload, process.env.PRIVATEREGISTRATIONKEY, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                reject(`no se puede generar el token`)
            } else {
                resolve(token)
            }
        })
    })
}

const generarJWTChangePassword = (id, password) => {
    return new Promise((resolve, reject) => {
        const payload = { id, password }

        JWT.sign(payload, process.env.PRIVATESECRETJWTKEY, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                reject(`no se puede generar el token`)
            } else {
                resolve(token)
            }
        })
    })
}

module.exports = { generaJWT, generarRegistrationJWT, generarJWTChangePassword }