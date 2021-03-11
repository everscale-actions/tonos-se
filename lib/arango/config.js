const path = require('path');
const os = require('os');

const appPath = path.join(appsPath, "arango")
const binPath = path.join(appPath, "usr", "sbin", "arangod") + (os.platform() === 'win32' ? ".exe" : "")
const workingDir = path.join(dataPath, "arango")
const pidFilePath = path.join(workingDir, "arango.pid")

exports.getConfig = () => {
    return { 
        "appPath": appPath,
        "binPath": binPath,
        "pidFilePath": pidFilePath,
        "paramsStart": ["--supervisor",
                        "--config", path.join(appPath,"config"),
                        "--server.endpoint", process.env.ARANGO_ENDPOINT ,
                        "--server.authentication", "false", 
                        "--log.foreground-tty", "true",
                        "--pid-file", pidFilePath,
                        "--javascript.startup-directory", path.join(appPath, "usr", "share", "arangodb3", "js"),
                        "--javascript.app-path", path.join(appPath, "var", "lib", "arangodb3-apps"),
                        "--database.directory", path.join(workingDir,"db")],
        "paramsStop": [],
        "workingDir": workingDir
    }
}
