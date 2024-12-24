const sequelize = require("./sequelize");
const { } = require("../general/customTypes");
const { } = require("../general/models");


sequelize.sync({alter: true});