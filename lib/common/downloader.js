const axios = require('axios');
const fs = require('fs');
const path = require("path")
const progress = require('progress')


exports.getConfigFile = async function(dstPath, fileUrl ) {
	const resp = await axios.get(fileUrl);
	return fs.writeFileSync(dstPath, resp.data);
}

exports.getBinaryFile = async function(dstFolder, dstFileName, fileUrl){
	fs.mkdirSync(dstFolder, { recursive: true })

	const pathToFile = path.join(dstFolder, dstFileName)
	const { data, headers } = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
    });

	const contentLength = headers['content-length'];

	const progressBar = new progress('-> downloading [:bar] :percent :etas', {
		width: 40,
		complete: '=',
		incomplete: ' ',
		renderThrottle: 1,
		total: parseInt(contentLength)
	  })
  
    data.on('data', (chunk) => progressBar.tick(chunk.length))

    data.pipe(fs.createWriteStream(pathToFile))

	console.log("Downloading finished")
}

