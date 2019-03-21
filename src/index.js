import config from './config';
import routes from 'routes';

import createDatabase from './services/mongoDatabaseService';
import createSensors from './services/sensorsService';

import getApiKeys from './helpers/getApiKeys';

import simpleExpress from 'services/simpleExpress/simpleExpress';

(async function() {
  const db = await createDatabase();
  const sensors = createSensors({ db });

  simpleExpress({
    port: config.port,
    routes,
    globalMiddlewares: [],
    routeParams: { db, sensors, apiKeys: getApiKeys('APIKEY') },
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
