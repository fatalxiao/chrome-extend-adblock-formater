var path = require('path');
var webpack = require('webpack');
var config = require('../config');

module.exports = {
	devtool: '#eval-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./src/index.js'
	],
	output: {
		path: config.build.assetsRoot,
		publicPath: '/static/',
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"'
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/,
			include: path.resolve(__dirname, '../')
		}, {
			test: /\.css$/,
			loader: 'style!css'
		}, {
			test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url'
		}]
	},
	resolve: {
		extensions: ['', '.js']
	}
};