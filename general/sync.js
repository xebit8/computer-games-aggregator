const sequelize = require("./sequelize");
const { } = require("../general/models");


sequelize.sync({alter: true});