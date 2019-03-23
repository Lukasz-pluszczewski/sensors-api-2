import _ from 'lodash';
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
          const apiKey = get('api-key');

          if (!apiKey || !_.has(apiKeys, apiKey)) {
            console.log('Api key not found', { apiKey, apiKeys });
            return {
              status: 401,
            };
          }

          const keyIndex = apiKeys[apiKey]

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
