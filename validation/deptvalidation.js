const { validate, ValidationError, Joi } = require("express-validation");

const deptValidation = {
  body: Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    deptphone: Joi.number().integer().required(),
  }),
};

const deptIdValidation = {
  params: Joi.object({
    deptid: Joi.number().integer().required(),
  }),
};

const deptIdqueryValidation = {
  query: Joi.object({
    id: Joi.number().integer(),
  }),
};

module.exports = { deptValidation, deptIdValidation, deptIdqueryValidation };
