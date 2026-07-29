// src/config/env.js
require('dotenv').config();

module.exports = {
  APP_NAME:               process.env.APP_NAME || 'NexaStock',
  NODE_ENV:               process.env.NODE_ENV || 'development',
  PORT:                   parseInt(process.env.PORT) || 3000,
  FRONTEND_URL:           process.env.FRONTEND_URL || 'http://localhost:4200',

  DB_HOST:                process.env.DB_HOST || 'localhost',
  DB_PORT:                parseInt(process.env.DB_PORT) || 3306,
  DB_NAME:                process.env.DB_NAME || 'nexastock',
  DB_USER:                process.env.DB_USER || 'root',
  DB_PASSWORD:            process.env.DB_PASSWORD || '',

  JWT_SECRET:             process.env.JWT_SECRET || 'nexastock_secret',
  JWT_EXPIRES_IN:         process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET:     process.env.JWT_REFRESH_SECRET || 'nexastock_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
