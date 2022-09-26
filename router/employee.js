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
      departmentId: req.body.departmentId,
    });
    res.status(201).json({ emp });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

route.get("/employee/:empid", async (req, res) => {
  try {
    const empid = req.params.empid;
    const emp = await Employees.findOne({
      where: {
        id: empid,
      },
      include: Departments,
    });
    if (emp != 0) {
      res.json(emp);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

route.put("/employee/:empid", async (req, res) => {
  try {
    const empid = req.params.empid;
    const emp = await Employees.findOne({
      where: {
        id: empid,
      },
    });
    if (emp == null) {
      res.status(404).send("Employee record not found");
    } else {
      await emp.update({
        id: req.body.id,
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age,
        role: req.body.role,
        phoneno: req.body.phoneno,
        departmentId: req.body.departmentId,
      });
      res.status(201).json({ emp });
    }
  } catch (err) {
    res.send(err);
  }
});

route.delete("/employee/:empid", async (req, res) => {
  try {
    const empid = req.params.empid;
    const emp = await Employees.findOne({
      where: {
        id: empid,
      },
    });
    if (emp == null) {
      res.status(404).send("Employee record not found");
    } else {
      emp.destroy();
      res.json({ emp });
    }
  } catch (err) {
    res.send(err);
  }
});

route.post("/department", async (req, res) => {
  try {
    const dept = await Departments.create({
      id: req.body.id,
      name: req.body.name,
      deptphone: req.body.deptphone,
    });
    res.status(201).json({ dept });
  } catch (err) {
    res.status(500).send(err);
  }
});

route.get("/department", async (req, res) => {
  try {
    const dept = await Departments.findAll();
    res.json(dept);
  } catch (err) {
    res.status(500).send(err);
  }
});

route.get("/department/:deptid", async (req, res) => {
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

route.put("/department/:deptid", async (req, res) => {
  try {
    const deptid = req.params.deptid;
    const dept = await Departments.findOne({
      where: {
        id: deptid,
      },
    });
    if (dept == null) {
      res.status(404).send("Record not found");
    } else {
      await dept.update({
        id: req.body.id,
        name: req.body.name,
        deptphone: req.body.deptphone,
      });
      res.status(201).json({ dept });
    }
  } catch (err) {
    res.send(err);
  }
});

route.delete("/department/:deptid", async (req, res) => {
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
});

route.get("/department/employeelist/:deptname", async (req, res) => {
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

module.exports = route;
