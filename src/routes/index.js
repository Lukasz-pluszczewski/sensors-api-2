import sensors from './sensors';
import health from './health';
import example from './example';

const routes = [
  ...sensors,
  ...health,
  ...example,
];

export default routes;
