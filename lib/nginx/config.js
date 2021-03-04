
exports.getConfig = () => {
    return { 
        "nginxDir": `${appRoot}/.server/nginx`,
        "nginxBin": `${appRoot}/.server/nginx/nginx`,
        "nginxConf": `${appRoot}/.server/nginx/nginx.conf`
    }
} 