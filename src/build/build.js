require('shelljs/global');
env.NODE_ENV = 'production';

var path = require('path');
var config = require('../config');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.prod');

var spinner = ora({
	text: 'building for production...',
	spinner: 'dots',
	color: 'white'
}).start();

var assetsPath = path.join(config.build.assetsRoot, '');
rm('-rf', assetsPath);
mkdir('-p', assetsPath);

webpack(webpackConfig, function (err, stats) {
	spinner.stop();
	if (err) {
		throw err;
	}
	process.stdout.write(
		stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n'
	);
});
