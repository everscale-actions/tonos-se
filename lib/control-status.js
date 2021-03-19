const appsPool = require('./apps/apps-pool');

async function status() {
  for (let i = 0; i < Object.keys(appsPool).length; i += 1) {
    const app = Object.values(appsPool)[i];
    process.stdout.write(await app.status());
  }
}

module.exports = status;
