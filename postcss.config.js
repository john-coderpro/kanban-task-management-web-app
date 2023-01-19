module.exports = {
  plugins: [
    require('postcss-combine-duplicated-selectors'),
    require('autoprefixer'),
    require('postcss-preset-env'),
  ],
}
