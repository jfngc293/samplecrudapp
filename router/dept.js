const express = require("express");
const Employees = require("../models/employee");
const Departments = require("../models/dept");
const { validate, ValidationError, Joi } = require("express-validation");
const {
  deptValidation,
  deptIdValidation,
} = require("../validation/deptvalidation");

const route = express.Router();

route.use(express.json());

route.post("/", validate(deptValidation, {}, {}), async (req, res) => {
  try {
    const deptid = req.body.id;
    const tDept = await Departments.findOne({
      where: {
        id: deptid,
      },
    });
    if (tDept == null) {
      const dept = await Departments.create({
        id: req.body.id,
        name: req.body.name,
        deptphone: req.body.deptphone,
      });
      res.status(201).json({ dept });
    } else {
      res.json({ message: "Department with same ID exists!" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

route.get("/", async (req, res) => {
  try {
    const dept = await Departments.findAll();
    res.json(dept);
  } catch (err) {
    res.status(500).send(err);
  }
});

route.get("/:deptid", validate(deptIdValidation, {}, {}), async (req, res) => {
  try {
    const deptid = req.params.deptid;
    const dept = await Departments.findAll({
      where: {
        id: deptid,
      },
    });
    if (dept.length > 0) {
      res.json(dept);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

route.put("/:deptid", validate(deptIdValidation, {}, {}), async (req, res) => {
  try {
    let flag = 0;
    const deptid = req.params.deptid;
    const dept = await Departments.findOne({
      where: {
        id: deptid,
      },
    });
    if (dept == null) {
      res.status(404).send("Record not found");
    } else {
      if (req.body.id != deptid) {
        flag = 1;
      }
      if (!flag) {
        await dept.update({
          id: req.body.id,
          name: req.body.name,
          deptphone: req.body.deptphone,
        });
        res.status(201).json({ dept });
      } else {
        const tDept = await Departments.findOne({
          where: {
            id: req.body.id,
          },
        });
        if (tDept == null) {
          await dept.update({
            id: req.body.id,
            name: req.body.name,
            deptphone: req.body.deptphone,
          });
          res.status(201).json({ dept });
        } else {
          res.json({ message: "Department with same ID exists!" });
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
});

route.delete(
  "/:deptid",
  validate(deptIdValidation, {}, {}),
  async (req, res) => {
    try {
      const deptid = req.params.deptid;
      const dept = await Departments.findOne({
        where: {
          id: deptid,
        },
      });
      if (dept == null) {
        res.status(404).send("Department not found");
      } else {
        dept.destroy();
        res.json({ dept });
      }
    } catch (err) {
      res.send(err);
    }
  }
);

route.get("/employeelist/:deptname", async (req, res) => {
  try {
    const deptname = req.params.deptname;
    const dept = await Departments.findOne({
      where: {
        name: deptname,
      },
    });
    const deptid = dept.id;
    const emp = await Employees.findAll({
      where: {
        departmentId: deptid,
      },
    });
    res.json(emp);
  } catch (err) {
    res.send(err);
  }
});

route.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

module.exports = route;
