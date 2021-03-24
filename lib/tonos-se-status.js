const appsPool = require('./apps/apps-pool');

async function status() {
  return Promise.all(appsPool.map((app) => app.status()));
}

module.exports = status;
