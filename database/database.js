const Sequelize = require('sequelize');
const connection = new Sequelize('blogcrud','root','123456',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
})

module.exports = connection