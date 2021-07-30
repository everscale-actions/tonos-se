#!/usr/bin/env node

const getPackagesVersions = require('packages-versions');
const control = require('../lib/control');

(async () => {
  try {
    await control.update();
    // eslint-disable-next-line global-require

    console.log(await getPackagesVersions('@ton-actions/tonos-se-package'));
    const tonosSe = require('@ton-actions/tonos-se-package');
    console.log(JSON.stringify(await tonosSe.version(), null, 2));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  }
})();
