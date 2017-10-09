const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV;

//================================================================

let plugins =
	[
		new webpack.DefinePlugin({
			__DEV__: env !== 'production',
			'process.env':
        {
				  'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			  }
		}),

		new webpack.NoEmitOnErrorsPlugin()
	];

if (env === 'production')
	{
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			comments: false,
			compress: {
				dead_code: true,
				booleans: true,
				loops: true,
				unused: true,
				warnings: false,
				drop_console: true
			}
		}));
	}
else
	{
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

const entryPoint =
  (env === "production")
  ?
    {
      app: './client/app.js'
    }
  :
    [
      'webpack-hot-middleware/client',
      './client/app.js'
    ]
;

//================================================================

module.exports =
{
	entry: entryPoint,

	output:
		{
			filename: 'server/public/build/bundle.js',
			sourceMapFilename: 'server/public/build/bundle.map'
		},

  devtool: env === 'production' ? 'source-map' : 'eval',
  plugins: plugins,

  devServer:
    {
      hot: true
    },

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