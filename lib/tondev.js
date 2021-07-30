const control = require('control');

async function install(version) {
  let pack;

  if (version) {
    pack = `${tonosPackageName}@${version}`;
  } else if (packageDependencies['tonos-se-package']) {
    pack = packageDependencies['tonos-se-package'];
  } else {
    pack = tonosPackageName;
  }

  await new Promise(((resolve, reject) => {
    npm.load(() => {
      npm.commands.install([pack], (err) => { if (err) { reject(err); } });
      resolve();
    });
  }));
}

async function update() {
  await install('latest');
}

module.exports.install = install;
module.exports.update = update;
