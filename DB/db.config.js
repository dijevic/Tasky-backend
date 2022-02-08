const { Sequelize } = require('sequelize')




// const sequelize = new Sequelize('todo', 'root', null, {
//     host: 'localhost',
//     dialect: 'mariadb',


// });

// PRODUCTION

const test = ';;'

const sequelize = new Sequelize('bcy6kjq7p7lcjmoivkih', 'untnjcnnl2p5u1u1', '1qozASuovYgka8ztZZCk', {
    host: 'bcy6kjq7p7lcjmoivkih-mysql.services.clever-cloud.com',
    dialect: 'mysql',


});





module.exports = sequelize