const express = require("express");
const Employees = require("../models/employee");
const Departments = require("../models/dept");

const route = express.Router();

route.get("/", (req, res) => {
  res.send("ZOHO");
});

route.get("/employee", async (req, res) => {
  try {
    const employees = Employees.findAll();
    res.json({ employees });
  } catch (err) {
    res.status(500).send(err);
  }
});

route.post("/employee", async (req, res) => {
  try {
    const emp = await Employees.create(req.body);
    console.log(emp.id);
    res.json({ emp });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = route;
