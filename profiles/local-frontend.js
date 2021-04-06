const SECTION = 'insights';
const APP_ID = 'manifests';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/${SECTION}/subscriptions`] = {
  host: `https://localhost:${FRONTEND_PORT}`
};
routes[`/${SECTION}/subscriptions/${APP_ID}`] = {
  host: `https://localhost:${FRONTEND_PORT}`
};
routes[`/beta/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
