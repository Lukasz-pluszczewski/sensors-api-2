import config from './config';
import routes from 'routes';

import createDatabase from './services/mongoDatabaseService';
import createSensors from './services/sensorsService';

import simpleExpress from 'services/simpleExpress/simpleExpress';

(async function() {
  const db = await createDatabase();
  const sensors = createSensors({ db });

  sensors.startMonitoring();

  let envFound = 1;
  const apiKeys = [];
  while (envFound) {
    if (process.env[`APIKEY${envFound}`]) {
      apiKeys[envFound] = process.env[`APIKEY${envFound}`];
      envFound++;
    } else {
      envFound = 0;
    }
  }

  console.log('Api keys found', apiKeys);

  simpleExpress({
    port: config.port,
    routes,
    globalMiddlewares: [],
    routeParams: { db, sensors, apiKeys },
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
