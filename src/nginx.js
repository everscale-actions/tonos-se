exports.setup = function(platform) {
    console.log(platform);
    switch (platform) {
        case 'win32':
            windows();
            break;

        default:
            throw "Not supported platform";
    }
};

function windows() {
    const http = require('https');
    const fs = require('fs');
    const admZip = require('adm-zip');

    const file = fs.createWriteStream("nginx.zip");
    const request = http.get("https://nginx.org/download/nginx-1.18.0.zip", function(response) {
        response.pipe(file);
    });

    var zip = new admZip("nginx.zip");
    zip.extractAllTo("nginx", true);

    fs.readdir("nginx", (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
}