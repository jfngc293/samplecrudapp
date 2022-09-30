const express = require("express");
const Employees = require("../models/employee");
const Departments = require("../models/dept");
const { validate, ValidationError, Joi } = require("express-validation");
const {
  deptValidation,
  deptIdValidation,
  deptIdqueryValidation,
} = require("../validation/deptvalidation");
const {
  checkDeptbyId,
  createDept,
  findDeptbyId,
  updateDept,
} = require("../services/deptservices");

const route = express.Router();

route.use(express.json());

route.post("/", validate(deptValidation, {}, {}), async (req, res) => {
  try {
    // const deptid = req.body.id;
    if (await checkDeptbyId(req.body)) {
      const dept = await createDept(req.body);
      res.status(201).json({ dept });
    } else {
      res.json({ message: "Department with similar ID or name exists!" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

route.get("/", validate(deptIdqueryValidation), async (req, res) => {
  try {
    if (req.query.id == undefined) {
      const dept = await Departments.findAll();
      res.json(dept);
    } else {
      const deptid = req.query.id;
      const dept = await findDeptbyId(deptid);
      if (dept == null) {
        res.status(404).send("Department not found");
      } else {
        const emp = await Employees.findAll({
          where: {
            departmentId: deptid,
          },
        });
        if (emp.length > 0) {
          res.json(emp);
        } else {
          res.json({ message: "No employee in this department" });
        }
      }
    }
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
    const dept = await findDeptbyId(deptid);
    if (dept == null) {
      res.status(404).send("Record not found");
    } else {
      if (req.body.id != deptid) {
        flag = 1;
      }
      if (!flag) {
        console.log(req.body);
        let udept = await updateDept(deptid, req.body);
        res.status(201).json(udept);
      } else {
        if (await checkDeptbyId(req.body.id)) {
          let udept = updateDept(deptid, req.body);
          res.status(201).json(udept);
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
      const dept = await findDeptbyId(deptid);
      if (dept == null) {
        res.status(404).send("Department not found");
      } else {
        dept.destroy();
        res.json({ deleted: dept });
      }
    } catch (err) {
      res.send(err);
    }
  }
);

route.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

module.exports = route;
