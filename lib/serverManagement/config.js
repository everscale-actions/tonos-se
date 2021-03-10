const path = require('path');
const dir = appRoot
const os = require('os')

function getOsByPlatform(){
    const osp = {
        "win32": "Windows",
        "darwin": "macOS",
        "linux": "Linux"
    }
    return osp[os.platform()]
}

exports.getConfig = () => {
    return {
       // "releaseUrl": `https://github.com/ton-actions/node-se-binaries/releases/download/${process.env.NODESE_RELEASE_TAG}/release-${getOsByPlatform()}.tar.gz`
        "releaseUrl": `https://github.com/nrukavkov/nd-bin/releases/download/${process.env.NODESE_RELEASE_TAG}/release-${getOsByPlatform()}.tar.gz`
    }
} 