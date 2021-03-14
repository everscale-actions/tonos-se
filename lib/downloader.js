const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Progress = require('progress');

exports.getConfigFile = async (dstPath, fileUrl) => {
  const resp = await axios.get(fileUrl);
  return fs.writeFileSync(dstPath, resp.data);
};

exports.getBinaryFile = async (fileUrl, dstFolder) => {
  const dstFileName = path.basename(fileUrl);
  fs.mkdirSync(dstFolder, { recursive: true });

  const pathToFile = path.join(dstFolder, dstFileName);
  const { data, headers } = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream',
  });

  const contentLength = headers['content-length'];

  const progressBar = new Progress(`-> downloading ${dstFileName} [:bar] :percent :etas`, {
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
};
