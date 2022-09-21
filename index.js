const express = require("express");
const path = require("path");
const sequelize = require("./util/database");

const app = express();

app.use("/", require(path.join(__dirname, "router/employee.js")));

app.use((req, res) => {
  res.status(404).send("The requested page was not found on this server");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

let server = app.listen(3000, () => {
  var port = server.address().port;
  console.log(`Listening at http://localhost:${port}`);
});
