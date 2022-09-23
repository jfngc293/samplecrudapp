const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Employees = require("../models/employee");

const Departments = sequelize.define("department", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  deptphone: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
  },
});

Departments.hasMany(Employees);
Departments.sync();

sequelize.sync({ force: false });

module.exports = Departments;
