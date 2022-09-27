const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Departments = sequelize.define("department", {
  id: {
    type: Sequelize.INTEGER,
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

module.exports = Departments;
