import checkPassword from '../middleware/checkPassword';
import config from '../config';

const sensorsRoutes = [
  {
    path: '/sensors',
    handlers: {
      get: [
        checkPassword(config.password),
        ({ query, sensors }) => {
          return sensors.getSavedData(query.start, query.end)
            .then(result => ({ body: result }))
            .catch(error => ({ status: 500, body: { message: error.message } }));
        },
      ],
    },
  },
  {
    path: '/webhook',
    handlers: {
      post: [
        ({ req, res, next, get, apiKeys }) => {
          const keyIndex = apiKeys.indexOf(get('api-key'));

          if (keyIndex < 0) {
            return {
              status: 401,
            };
          }

          res.locals.keyIndex = keyIndex;
          next();
        },
        ({ query, get, body, res, req, sensors }) => {
          return Promise.all([
            sensors.saveSensorData(`temperature-${res.locals.keyIndex}`, parseFloat(body.temperature)),
            sensors.saveSensorData(`humidity-${res.locals.keyIndex}`, parseFloat(body.humidity)),
          ])
            .then(() => ({ status: 200 }))
            .catch(error => ({ status: 500 }));
        },
      ],
    },
  },
];

export default sensorsRoutes;
