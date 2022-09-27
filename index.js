const express = require("express");
const path = require("path");
const sequelize = require("./util/database");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const Employees = require("./models/employee");
const Departments = require("./models/dept");

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/employee", require(path.join(__dirname, "router/employee.js")));
app.use("/department", require(path.join(__dirname, "router/dept.js")));

app.use((req, res) => {
  res.status(404).send("The requested page was not found on this server");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    Departments.hasMany(Employees);
    Employees.belongsTo(Departments);
    Employees.sync();
    Departments.sync();
    sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

let server = app.listen(3000, () => {
  var port = server.address().port;
  console.log(`Listening at http://localhost:${port}`);
});
