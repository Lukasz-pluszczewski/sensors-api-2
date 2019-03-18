import axios from 'axios';
import _ from 'lodash';
import { insert, find } from 'services/mongoDatabaseService';
import config from '../config';

const isValidDate = date => (date instanceof Date && !isNaN(date));

const sensorsService = ({ db }) => {
  console.log('Creating sensors service');

  const axiosInstance = axios.create({
    baseURL: config.sensorsHost,
    headers: { authentication: config.sensorsPassword },
  });

  const sensorsServiceInstance = {
    interval: null,
    startMonitoring: (interval = config.sensorsInterval) => {
      sensorsService.interval = setInterval(sensorsServiceInstance.getSensorsData, interval);
    },
    stopMonitoring: () => {
      clearInterval(sensorsServiceInstance.interval);
    },
    getSensorsData: () => {
      axiosInstance.get('/sensor')
        .then(response => {
          // handle success
          console.log('Sensors response', response.data);

          if (response.data.isValid) {
            sensorsServiceInstance.saveSensorData('temperature-1', response.data.temperature)
              .then(() => console.log('Temperature saved'))
              .catch(error => console.log('Saving temperature failed', error));

            sensorsServiceInstance.saveSensorData('humidity-1', response.data.humidity)
              .then(() => console.log('Humidity saved'))
              .catch(error => console.log('Saving humidity failed', error));
          } else {
            console.log('Sensors error', 'Data not valid');
          }
        })
        .catch(error => {
          // handle error
          console.log('Sensors errors', error);
        });
    },
    getSavedData: (start, end) => {
      return Promise.all([
        sensorsServiceInstance.getSensorData('temperature-1', start, end),
        sensorsServiceInstance.getSensorData('humidity-1', start, end),
        sensorsServiceInstance.getSensorData('temperature-2', start, end),
        sensorsServiceInstance.getSensorData('humidity-2', start, end),
      ])
        .then(([
          temperature,
          humidity,
          temperature2,
          humidity2,
        ]) => ({
          temperature,
          humidity,
          temperature2,
          humidity2,
        }));
    },
    saveSensorData: (key, value) => {
      return insert(db, key)({
        value,
        timestamp: new Date(),
      });
    },
    getSensorData: (key, start, end) => {
      const query = {};

      if (start && isValidDate(new Date(start))) {
        _.set(query, 'timestamp.$gte', new Date(start));
      }
      if (end && isValidDate(new Date(end))) {
        _.set(query, 'timestamp.$lt', new Date(end));
      }

      return find(db, key)(query);
    },
  };

  return sensorsServiceInstance;
};

export default sensorsService;
