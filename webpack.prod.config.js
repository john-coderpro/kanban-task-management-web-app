const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const common = require('./webpack.common.config')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  output: {
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][hash][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
        description: 'task management web app',
        google: 'notranslate',
      },
    }),
    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /.*\.woff2$/,
          attributes: {
            as: 'font',
            type: 'font/woff2',
            crossorigin: false,
          },
        },
        {
          match: /.*\.woff$/,
          attributes: {
            as: 'font',
            type: 'font/woff',
            crossorigin: false,
          },
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          // the escaped backslashes in this regular expression
          // is to ensure things work properly on windows
          test: /[\\/]node_modules[\\/](react|react-loadable|react-dom|@dnd-kit[\\/]|nanoid|framer-motion)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
      },
    },
  },
})
