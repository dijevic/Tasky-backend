const { Sequelize } = require('sequelize')




const sequelize = new Sequelize('todo', 'root', null, {
    host: 'localhost',
    dialect: 'mariadb',


});





module.exports = sequelize