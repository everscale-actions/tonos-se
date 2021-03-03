// https://nodejs.org/api/process.html#process_process_platform
platform = process.platform;
console.log(`OS: ${platform}`);

var nginx = require('./nginx');

nginx.setup(platform);