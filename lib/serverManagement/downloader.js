const axios = require('axios');
const fs = require('fs');
const path = require("path")
const progress = require('progress')


exports.getConfigFile = async function(dstPath, fileUrl ) {
	const resp = await axios.get(fileUrl);
	return fs.writeFileSync(dstPath, resp.data);
}

exports.getBinaryFile = async function(dstFolder, dstFileName, fileUrl){
	console.log(`Downloading ${fileUrl}`)
	fs.mkdirSync(dstFolder, { recursive: true })

	const pathToFile = path.join(dstFolder, dstFileName)
	const { data, headers } = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
    });

	const contentLength = headers['content-length'];

	const progressBar = new progress(`-> downloading ${dstFileName} [:bar] :percent :etas`, {
		width: 40,
		complete: '=',
		incomplete: ' ',
		renderThrottle: 1,
		total: parseInt(contentLength)
	  })
  
    data.on('data', (chunk) => progressBar.tick(chunk.length))

	const writer = fs.createWriteStream(pathToFile);
	data.pipe(writer)

	return new Promise((resolve, reject) => {
		writer.on("finish", resolve);
		writer.on("error", reject);
	});
}

