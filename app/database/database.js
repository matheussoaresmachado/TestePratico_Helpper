const Sequelize = require('sequelize');

const connection = new Sequelize('matcadhp', 'matcadhp', 'senhadb2021', {
    host: 'mysql743.umbler.com',
    dialect: 'mysql',
    port: '41890'
});

module.exports = connection;
