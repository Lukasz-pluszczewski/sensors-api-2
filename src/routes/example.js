import checkPassword from '../middleware/checkPassword';
import config from '../config';

const healthRoutes = [
  {
    path: '*',
    handlers: {
      get: [
        checkPassword(config.password),
        () => ({
          status: 404,
          body: {
            message: 'Not found',
          },
        }),
      ],
    },
  },
];

export default healthRoutes;
