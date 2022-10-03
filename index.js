const express = require("express");
const path = require("path");
const sequelize = require("./util/database");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const Employees = require("./models/employee");
const Departments = require("./models/dept");
const apiLimiter = require("./ratelimit");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork();
  }
}

function childProcess() {
  console.log(`Worker ${process.pid} started...`);

  const app = express();

  app.use(apiLimiter);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/employees", require(path.join(__dirname, "router/employee.js")));
  app.use("/departments", require(path.join(__dirname, "router/dept.js")));

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
}
