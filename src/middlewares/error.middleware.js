// src/middlewares/error.middleware.js
const logger = require('../config/logger');

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route introuvable : ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Erreur interne du serveur' : err.message,
  });
};

module.exports = { notFound, errorHandler };
