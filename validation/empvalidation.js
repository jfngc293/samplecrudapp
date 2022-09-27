const { validate, ValidationError, Joi } = require("express-validation");

const employeeValidation = {
  body: Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    salary: Joi.number().integer(),
    age: Joi.number().integer().required(),
    role: Joi.string().required(),
    phoneno: Joi.string().required().min(10).max(10),
    departmentId: Joi.number().integer(),
  }),
};

const employeeIdValidation = {
  params: Joi.object({
    empid: Joi.number().integer().required(),
  }),
};

module.exports = { employeeValidation, employeeIdValidation };
