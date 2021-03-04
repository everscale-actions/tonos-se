serverDir = ".server";
// https://nodejs.org/api/process.html#process_process_platform
platform = process.platform;

exports.install = function() {
    require('./install/nginx').setup(platform, serverDir);
};