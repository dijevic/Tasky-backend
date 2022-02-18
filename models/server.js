const express = require('express');
const cors = require('cors');
const sequelize = require('../DB/db.config');
const Usuario = require('../models/Usuario')
const Task = require('../models/Task')
const Category = require('../models/Category');
const notFound = require('../middlewares/notFound');



class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/v1/auth',
            user: '/api/v1/user',
            category: '/api/v1/category',
            task: '/api/v1/task',

        }
        this.dbConection()
        this.middlewares()
        this.routes()
        // test to keep heroku working 
        this.keepHerokuWorking()


    }

    async dbConection() {
        try {
            Usuario.hasMany(Task, { foreignKey: `user_id`, as: 'tasks' })
            Task.belongsTo(Usuario, { foreignKey: `user_id`, as: 'user' })


            Usuario.hasMany(Category, { foreignKey: `category_user_id`, as: 'categories' })
            Category.belongsTo(Usuario, { foreignKey: `category_user_id`, as: 'user_category_id' })


            Category.hasMany(Task, { foreignKey: `category_id`, as: 'category_tasks' })
            Task.belongsTo(Category, { foreignKey: `category_id`, as: 'task_category' })


            await sequelize.authenticate()
            console.log('db online')


        } catch (e) {
            console.log(e)
            // throw new Error(e)
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
        this.app.use(this.paths.category, require('../routes/category'))
        this.app.use(notFound)

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`servidor corriendo en el puerto , ${this.port}`)
        })

    }

    keepHerokuWorking() {
        let i = 0
        setTimeout(() => {
            i++
        }, 1700000)
    }

}

module.exports = {
    Server
}



