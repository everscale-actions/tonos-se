requiredVersion = "1.18.0";
versionRegexp = new RegExp("nginx version: nginx\\/(?<version>\\d+\\.\\d+\\.\\d+).*");

exports.setup = function( /**String*/ platform, /**String*/ serverDir) {
    switch (platform) {
        case 'win32':
            windows(serverDir);
            break;

        default:
            throw `Not supported platform: ${platform}`;
    }
};

function windows(serverDir) {
    const https = require('https'),
        fs = require('fs-extra'),
        admZip = require('adm-zip'),
        temp = require('temp'),
        path = require('path'),
        childProcess = require('child_process');

    var exePath = path.join(serverDir, "nginx", "nginx.exe");

    if (fs.existsSync(exePath)) {
        const currentVersionString = childProcess.spawnSync("nginx", ["-v"], { cwd: path.join(serverDir, "nginx") }).output[2].toString('utf8');
        if (versionRegexp.test(currentVersionString)) {
            const currentVersion = currentVersionString.match(versionRegexp).groups.version;
            if (currentVersion == requiredVersion) {
                console.debug(`Nginx ${requiredVersion} already installed`);
                return;
            } else {
                console.debug(`Nginx ${currentVersion} found but ${requiredVersion} is needed`);
            }
        }
    }

    const nginxZip = temp.path();
    var tempDir = temp.mkdirSync();
    const fsStream = fs.createWriteStream(nginxZip);
    https.get(`https://nginx.org/download/nginx-${requiredVersion}.zip`, function(response) {
        var stream = response.pipe(fsStream);
        stream.on("finish", function() {
            new admZip(nginxZip)
                .extractAllTo(tempDir, true);

            //bug: this command overwrites folders entirely, so logs should not be cleaned
            fs.moveSync(path.join(tempDir, fs.readdirSync(tempDir)[0]), path.join(serverDir, "nginx"), { overwrite: true });
        });
    });
}