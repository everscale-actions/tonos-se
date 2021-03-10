const path = require('path');
const dir = path.join(appRoot, ".server", "arango");
const os = require('os')

exports.getConfig = () => {
    return { 
        "arangoRootDir": dir,
        "arangoBin": path.join(dir, "arango" , "usr", "bin", "arango") + (os.platform() === 'win32' ? path.join(dir, ".exe") : ""),
        "arangoPidFile":  path.join(dir, "arango.pid"),
    }
} 