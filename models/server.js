const express = require('express');
const cors = require('cors');
const sequelize = require('../DB/db.config');
const Usuario = require('../models/Usuario')
const Task = require('../models/Task')



class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/v1/auth',
            user: '/api/v1/user',
            task: '/api/v1/task'

        }
        this.dbConection()
        this.middlewares()
        this.routes()


    }

    async dbConection() {
        try {
            Usuario.hasMany(Task, { foreignKey: `user_id`, as: 'tasks' })
            Task.belongsTo(Usuario, { foreignKey: `user_id`, as: 'user' })

            await sequelize.sync({ alter: true })
            console.log('db online')

        } catch (e) {
            throw new Error(e)
        }
    }

    middlewares() {
        this.app.use(express.static('public'))
        this.app.use(cors())
        // helmet
        this.app.use(express.json())
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.user, require('../routes/user'))
        this.app.use(this.paths.task, require('../routes/task'))

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`servidor corriendo en el puerto , ${this.port}`)
        })

    }

}

module.exports = {
    Server
}



