// server.js
const app    = require('./src/app');
const env    = require('./src/config/env');
const logger = require('./src/config/logger');
const { sequelize } = require('./src/models');

const PORT = env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connexion à la base de données établie');

    app.listen(PORT, () => {
      logger.info(`Serveur NexaStock démarré sur le port ${PORT} [${env.NODE_ENV}]`);
    });
  } catch (err) {
    logger.error('Impossible de démarrer le serveur :', err);
    process.exit(1);
  }
};

start();
