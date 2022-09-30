const Employees = require("../models/employee");

const findEmployeebyID = async (eid) => {
  try {
    const emp = await Employees.findOne({
      where: {
        id: eid,
      },
    });
    return emp;
  } catch (err) {
    return err;
  }
};

const createEmployee = async (employee) => {
  try {
    const emp = await Employees.create({
      id: employee.id,
      name: employee.name,
      salary: employee.salary,
      age: employee.age,
      role: employee.role,
      phoneno: employee.phoneno,
      departmentId: employee.departmentId,
    });
    return emp;
  } catch (err) {
    return err;
  }
};
const findEmployeebyName = async (ename) => {
  try {
    const emp = await Employees.findOne({
      where: {
        name: ename,
      },
    });
    return emp;
  } catch (err) {
    return err;
  }
};
const checkEmployeebyId = async (eid) => {
  try {
    const emp = await Employees.findOne({
      where: {
        id: eid,
      },
    });
    if (emp == null) return true;
    return false;
  } catch (err) {
    return err;
  }
};

const updateEmployee = async (eid, employee) => {
  try {
    const emp = await findEmployeebyID(eid);
    await emp.update({
      id: employee.id,
      name: employee.name,
      salary: employee.salary,
      age: employee.age,
      role: employee.role,
      phoneno: employee.phoneno,
      departmentId: employee.departmentId,
    });
    return emp;
  } catch (err) {
    return err;
  }
};

module.exports = {
  findEmployeebyID,
  createEmployee,
  findEmployeebyName,
  checkEmployeebyId,
  updateEmployee,
};
