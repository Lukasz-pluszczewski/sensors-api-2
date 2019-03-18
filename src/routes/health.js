import checkPassword from '../middleware/checkPassword';
import config from '../config';

const healthRoutes = [
  {
    path: '/health',
    handlers: {
      get: [
        checkPassword(config.password),
        ({ body, query, params, originalUrl, protocol, xhr, get, req, db }) => {
          return {
            body: {
              status: 'healthy',
              dbConnected: db.serverConfig.isConnected(),
            },
          };
        },
      ],
    },
  },
];

export default healthRoutes;
