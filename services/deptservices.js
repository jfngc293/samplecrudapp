const Departments = require("../models/dept");
const { Op } = require("sequelize");

const checkDeptbyId = async (department) => {
  try {
    const dept = await Departments.findOne({
      where: {
        [Op.or]: [{ id: department.id }, { name: department.name }],
      },
    });
    if (dept == null) return true;
    return false;
  } catch (err) {
    return err;
  }
};

const createDept = async (dept) => {
  try {
    const tdept = await Departments.create({
      id: dept.id,
      name: dept.name,
      deptphone: dept.deptphone,
    });
    return tdept;
  } catch (err) {
    return err;
  }
};

const findDeptbyId = async (deptid) => {
  const dept = Departments.findOne({
    where: {
      id: deptid,
    },
  });
  return dept;
};

const updateDept = async (deptid, department) => {
  try {
    const dept = await findDeptbyId(deptid);
    await dept.update({
      id: department.id,
      name: department.name,
      deptphone: department.deptphone,
    });
    return dept;
  } catch (err) {
    return err;
  }
};
module.exports = { checkDeptbyId, createDept, findDeptbyId, updateDept };
