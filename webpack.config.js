var webpack = require('webpack');
var path = require('path');

module.exports =
{
	entry:
		{
			app: './client/app.js'
		},

	output:
		{
			filename: 'server/public/build/bundle.js',
			sourceMapFilename: 'server/public/build/bundle.map'
		},

	devtool: '#source-map',

	module:
		{
			loaders:
			[
				{
					test: /\.jsx?$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
					query:
						{
							presets: ['react', 'es2015' ]
						}
				},

				{
          test: /\.scss$/,
          use:
					[
						{
              loader: "style-loader"
            },

						{
							loader: "css-loader"
						},

						{
							loader: "sass-loader"
            }
					]
				}
			]
	}
};