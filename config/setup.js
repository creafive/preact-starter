const { join } = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const SWPrecache = require('sw-precache-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const HTML = require('html-webpack-plugin');
const uglify = require('./uglify');
const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const root = join(__dirname, '..');

module.exports = isProd => {
	// base plugins array
	const plugins = [
		new Clean(['dist'], { root }),
		new Copy([{ context: 'src/static/', from: '**/*.*' }]),
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
		new HTML({ template: 'src/index.html' }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
		}),
		new FaviconsWebpackPlugin({
			logo: path.join(__dirname, '../src', 'static','icon.png'),
			prefix: 'icons/',
			inject: false,
			icons: {
	      android: true,
				firefox: true,
	      appleIcon: true,
	      appleStartup: true,
				windows: true,
	      coast: false,
	      favicons: false,
	      opengraph: false,
	      twitter: false,
	      yandex: false
	    }
		})
	];

	if (isProd) {
		plugins.push(
			new webpack.LoaderOptionsPlugin({ minimize:true }),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new webpack.optimize.UglifyJsPlugin(uglify),
			new ExtractText('styles.[hash].css'),
			new SWPrecache({
				minify: true,
				filename: 'sw.js',
				dontCacheBustUrlsMatching: /./,
				navigateFallback: 'index.html',
				staticFileGlobsIgnorePatterns: [/\.map$/]
			})
		);
	} else {
		// dev only
		plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin()
		);
	}

	return plugins;
};
