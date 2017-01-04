var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config.dev.js');
var config = require('../config');

var app = new (require('express'))();
var port = config.dev.port;

var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.use(function (req, res) {
	// res.sendFile(__dirname + './src/index.html');
	res.sendFile(path.resolve(config.dev.root, './src/index.html'));
});

app.listen(port, function (error) {
	if (error) {
		console.error(error);
	} else {
		console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
	}
});