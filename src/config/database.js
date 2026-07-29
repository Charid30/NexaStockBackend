// src/config/database.js
const { Sequelize } = require('sequelize');
const env    = require('./env');
const logger = require('./logger');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host:    env.DB_HOST,
  port:    env.DB_PORT,
  dialect: 'mysql',
  logging: (msg) => {
    if (env.NODE_ENV === 'development') logger.debug(msg);
  },
  pool: {
    max:     10,
    min:     0,
    acquire: 30000,
    idle:    10000,
  },
  define: {
    underscored:    true,
    freezeTableName: true,
  },
});

module.exports = { sequelize };
