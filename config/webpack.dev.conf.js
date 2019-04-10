const utils = require('./utils');
const webpackMerge = require('webpack-merge');
// const BundleAnalyzerPlugin =
// require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseWebpackConfig = require('./webpack.base.conf');
const METADATA = webpackMerge(baseWebpackConfig().metadata, {
  host: 'localhost',
  port: 0,
});

process.env.NODE_ENV = process.env.NODE_ENV ?
  process.env.NODE_ENV : 'development';

module.exports = function () {
  return webpackMerge(baseWebpackConfig(), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      path: utils.root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
    },
    module: {
      rules: utils.styleLoaders({sourceMap: false}),
      /* rules: [
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader', {
            loader: 'postcss-loader', options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({root: loader.resourcePath}),
                require('autoprefixer')(),
              ],
            },
          }],
        },
        {
          test: /\.less/,
          use: ['vue-style-loader', 'css-loader', 'less-loader'],
        },
      ], */
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
    ],
    devServer: {
      // contentBase: utils.root('src'),
      host: METADATA.host,
      port: METADATA.port,
      inline: true,
      historyApiFallback: true,
      watchOptions: {
        // if you're using Docker you may need this
        // aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/,
      },
      /* https: true, */
      /* https: {
        key: fs.readFileSync("cert/server.key"),
        cert: fs.readFileSync("cert/server.crt"),
        ca: fs.readFileSync("cert/ca.pem"),
      }, */
      proxy: {
        '/api': {
          // target: 'https://fm.hzztai.com',
          // target: 'http://192.168.1.18:8084',
          target: 'http://192.168.1.91:8084',
          secure: false,
          changeOrigin: true,
        },
        '/image.php': {
          // target: 'https://fm.hzztai.com',
          // target: 'http://192.168.1.18:8084',
          target: 'http://192.168.1.91:8084',
          secure: false,
          changeOrigin: true,
        },
      },
    },
    performance: {
      // hints: 'warning',
    },
  });
};
