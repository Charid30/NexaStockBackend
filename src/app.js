// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const hpp = require('hpp');
const env = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();
const { version: APP_VERSION } = require('../package.json');

app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:4200'].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (env.NODE_ENV === 'development') return callback(null, true);
    callback(new Error(`Origine non autorisée : ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const AUTH_PATHS = ['/api/auth/register', '/api/auth/login', '/api/auth/refresh'];

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => AUTH_PATHS.some((p) => req.originalUrl.startsWith(p)),
  message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 500 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives, réessayez dans 15 minutes.' },
});

// ── Middlewares globaux ────────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') obj[key] = xss(obj[key]);
      else if (typeof obj[key] === 'object') sanitize(obj[key]);
    }
  };
  sanitize(req.body);
  next();
});

app.use(hpp());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use('/api', generalLimiter);
AUTH_PATHS.forEach((p) => app.use(p, authLimiter));

// ── Fichiers statiques (logos) ────────────────────────────────────────────────
app.use('/uploads', express.static('src/uploads'));

// ── Route de santé ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Bienvenue sur l'API ${env.APP_NAME}`,
    version: APP_VERSION,
    environment: env.NODE_ENV,
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', require('./routes'));

// ── Erreurs ───────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
