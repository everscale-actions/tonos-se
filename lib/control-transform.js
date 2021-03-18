const replace = require('replace-in-file');
const path = require('path');

function transform(targets) {
  // eslint-disable-next-line no-restricted-syntax
  for (const target of targets) {
    replace.sync(target);
  }
}

function transformPorts() {
  const targets = [
    {
      files: path.join(global.appsPath, 'nginx', 'conf', 'nginx.conf'),
      from: /listen \d+ reuseport;/g,
      to: `listen ${global.nginxPort} reuseport;`,
    },
    {
      files: path.join(global.appsPath, 'nginx', 'conf', 'nginx.conf'),
      from: /server 127\.0\.0\.1:\d+;/m,
      to: `server 127.0.0.1:${global.qServerPort};`,
    },
    {
      files: path.join(global.appsPath, 'ton-node', 'cfg'),
      from: /"server": "127\.0\.0\.1:\d+",/g,
      to: `"server": "127.0.0.1:${global.arangoPort}",`,
    },
    {
      files: path.join(global.appsPath, 'ton-node', 'cfg'),
      from: /"port": \d+,/g,
      to: `"port": ${global.nodeSePort},`,
    },
  ];
  transform(targets);
}

module.exports = transformPorts;
