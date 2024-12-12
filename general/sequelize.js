const { Sequelize } = require("sequelize");
const { database, username, password } = require("./2auth");

const sequelize = Sequelize(DatabaseError, username, password, {
    host: 'localhost',
    dialect: 'postgres',
    omitNull: true,
});
module.exports = sequelize;