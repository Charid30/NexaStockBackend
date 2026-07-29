// src/middlewares/validate.middleware.js
const { error } = require('../utils/response.util');

const validate = (schema) => (req, res, next) => {
  const { error: err } = schema.validate(req.body, { abortEarly: false });
  if (err) {
    const errors = err.details.map((d) => d.message);
    return error(res, 'Données invalides', 422, errors);
  }
  next();
};

module.exports = validate;
