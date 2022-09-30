const express = require("express");
const Employees = require("../models/employee");
const sequelize = require("sequelize");
const { validate, ValidationError, Joi } = require("express-validation");
const {
  employeeValidation,
  employeeIdValidation,
} = require("../validation/empvalidation");
const {
  findEmployeebyID,
  createEmployee,
  findEmployeebyName,
  checkEmployeebyId,
  updateEmployee,
} = require("../services/empservice");

const route = express.Router();

route.use(express.json());

route.get("/", async (req, res) => {
  try {
    // console.log(req.query.name);
    if (req.query.name == undefined) {
      const employees = await Employees.findAll();
      res.json(employees);
    } else {
      const empname = req.query.name;
      const emp = await findEmployeebyName(empname);
      res.json(emp);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

route.post("/", validate(employeeValidation, {}, {}), async (req, res) => {
  try {
    const empid = req.body.id;
    const employee = req.body;
    if (await checkEmployeebyId(empid)) {
      const emp = await createEmployee(employee);
      res.status(201).json({ emp });
    } else {
      res.json({ message: "Employee with same ID exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

route.get(
  "/:empid",
  validate(employeeIdValidation, {}, {}),
  async (req, res) => {
    try {
      const empid = req.params.empid;
      const emp = await findEmployeebyID(empid);
      if (emp != null) {
        res.json(emp);
      } else {
        res.status(404).send("Record not found");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

route.put(
  "/:empid",
  validate(employeeIdValidation, {}, {}),
  async (req, res) => {
    try {
      let flag = 0;
      const empid = req.params.empid;
      const emp = await findEmployeebyID(empid);
      if (emp == null) {
        res.status(404).send("Employee record not found");
      } else {
        if (req.body.id != empid) {
          flag = 1;
        }
        if (!flag) {
          let uemp = await updateEmployee(empid, req.body);
          res.status(201).json(uemp);
        } else {
          if (await checkEmployeebyId(req.body.id)) {
            let uemp = await updateEmployee(empid, req.body);
            res.status(201).json(uemp);
          } else {
            res.json({ message: "Employee with same ID exists!" });
          }
        }
      }
    } catch (err) {
      res.send(err);
    }
  }
);

route.delete(
  "/:empid",
  validate(employeeIdValidation, {}, {}),
  async (req, res) => {
    try {
      const empid = req.params.empid;
      const emp = await findEmployeebyID(empid);
      if (emp == null) {
        res.status(404).send("Employee record not found");
      } else {
        emp.destroy();
        res.json({ deleted: emp });
      }
    } catch (err) {
      res.send(err);
    }
  }
);

route.get("/test", async (req, res) => {
  const emp = await Employees.findAll({
    attributes: [
      "role",
      [sequelize.fn("count", sequelize.col("role")), "count"],
    ],
    group: "role",
  });
  res.json(emp);
});

route.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

module.exports = route;
