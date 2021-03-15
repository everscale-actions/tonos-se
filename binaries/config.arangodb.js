module.exports = (version) => {
    const basePath = "https://download.arangodb.com/arangodb37/Community";
    return {
        "Linux" : { 
            "url": `${basePath}/Linux/arangodb3-linux-${version}.tar.gz`, 
            "pathInArchive": `arangodb3-linux-${version}`,
        },
        "Windows" : {
            "url": `${basePath}/Windows/ArangoDB3-${version}_win64.zip`, 
            "pathInArchive": `ArangoDB3-${version}_win64`
        },
        "macOS" : {
            "url": `${basePath}/MacOSX/arangodb3-macos-${version}.tar.gz`, 
            "pathInArchive": `arangodb3-macos-${version}`
        }
    }
}
