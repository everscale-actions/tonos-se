const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Progress = require('progress');

async function getBinaryFile(fileUrl, dstFolder) {
  const dstFileName = path.basename(fileUrl);
  fs.mkdirSync(dstFolder, { recursive: true });

  const pathToFile = path.join(dstFolder, dstFileName);
  const { data, headers } = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream',
  });

  const contentLength = headers['content-length'];

  const progressBar = new Progress(`* Downloading ${dstFileName} [:bar] :percent :etas left`, {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(contentLength, 10),
  });

  data.on('data', (chunk) => progressBar.tick(chunk.length));

  const writer = fs.createWriteStream(pathToFile);
  data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

module.exports.getBinaryFile = getBinaryFile;
