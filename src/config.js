var path = require('path');

module.exports = {
	build: {
		index: path.resolve(__dirname, 'dist/index.html'),
		assetsRoot: path.resolve(__dirname, 'dist'),
		assetsPublicPath: '',
		assetsSubDirectory: 'assets',
		productionSourceMap: false
	},
	dev: {
		port: 3000,
		root: __dirname,
		proxyTable: {}
	}
};
