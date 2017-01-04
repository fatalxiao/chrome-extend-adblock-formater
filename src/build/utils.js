var path = require('path');
var config = require('../config');

exports.publicPath = function (_path) {
	return path.posix.join(config.build.assetsPublicPath, _path);
};
exports.assetsPath = function (_path) {
	return path.posix.join(config.build.assetsSubDirectory, _path);
};