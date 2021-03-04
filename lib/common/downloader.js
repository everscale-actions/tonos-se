const axios = require('axios');
const fs = require('fs');

exports.getConfigFile = async function(dstPath, url ) {
	const resp = await axios.get(url);
	return fs.writeFileSync(dstPath, resp.data);
}