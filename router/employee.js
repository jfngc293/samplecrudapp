const express = require("express");
const Employees = require("../models/employee");
const Departments = require("../models/dept");
const swaggerJsDoc = require("../swagger.json");
const swaggerUI = require("swagger-ui-express");

const route = express.Router();

route.use(express.json());

route.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

route.get("/", (req, res) => {
  res.send("ZOHO");
});

route.get("/employee", async (req, res) => {
  try {
    const employees = await Employees.findAll();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

route.post("/employee", async (req, res) => {
  try {
    const emp = await Employees.create({
      id: req.body.id,
      name: req.body.name,
      salary: req.body.salary,
      age: req.body.age,
      role: req.body.role,
      phoneno: req.body.phoneno,
    });
    res.status(201).json({ emp });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = route;
