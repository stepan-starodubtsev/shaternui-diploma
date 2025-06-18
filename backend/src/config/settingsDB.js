const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected...'))
    .catch(err => console.log('Error: ' + err + " " + process.env.DB_HOST + ":" + (process.env.DB_PORT || 5432)));

module.exports = sequelize;
