const { Sequelize } = require('sequelize')

const db = process.env.DBNAME
const userDB = process.env.DBUSERNAME
const passwordDB = process.env.DBPASSWORD
const hostDB = process.env.DBHOST


// const sequelize = new Sequelize('todo', 'root', null, {
//     host: 'localhost',
//     dialect: 'mariadb',


// });

// PRODUCTION


const sequelize = new Sequelize(db, userDB, passwordDB, {
    host: hostDB,
    dialect: 'mysql',


});





module.exports = sequelize