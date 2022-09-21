const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("datab", "root", "password", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
