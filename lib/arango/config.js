const path = require('path');
const os = require('os')

exports.getConfig = () => {
    return { 
        "appPath": path.join(appsPath, "arango"),
        "binPath": path.join(appsPath, "arango" , "usr", "sbin", "arangod") + (os.platform() === 'win32' ? ".exe" : ""),
        "pidFilePath": path.join(dataPath, "arango.pid"),
    }
} 