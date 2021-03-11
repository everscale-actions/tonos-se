const path = require('path');
const os = require('os')

const appPath = path.join(appsPath, "nginx")
const binPath = path.join(appPath, "nginx") + (os.platform() === 'win32' ? ".exe" : "")
const workingDir = path.join(dataPath, "nginx")
const pidFilePath = path.join(workingDir, "nginx.pid")

exports.getConfig = () => {
    return { 
        "appPath": appPath,
        "binPath": binPath,
        "pidFilePath": pidFilePath,
        "paramsStart": ["-c", `${path.join(appPath, "conf" , "nginx.conf")}`,"-g","daemon off;"],
        "paramsStop": ["-c", `${path.join(appPath, "conf" , "nginx.conf")}`, "-s", "stop"],
        "workingDir": workingDir
    }
} 