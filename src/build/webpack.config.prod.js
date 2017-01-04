var path = require('path');
var config = require('../config');
var utils = require('./utils');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './src/index.js',
		react: ['react']
	},
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('[id].[chunkhash].js')
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['react'],
			filename: utils.assetsPath('react.js'),
			minChunks: Infinity
		}),
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false,
			},
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin(utils.publicPath('[name].[contenthash].css')),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'build/index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			}
		})
	],
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/,
			include: path.resolve(__dirname, '../')
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style", "css")
		}, {
			test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url',
			query: {
				limit: 100,
				name: utils.assetsPath('[name].[hash:7].[ext]')
			}
		}]
	},
	resolve: {
		extensions: ['', '.js']
	}
};