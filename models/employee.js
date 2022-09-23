const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Employees = sequelize.define("employee", {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  salary: {
    type: Sequelize.INTEGER,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneno: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

Employees.sync();

module.exports = Employees;
