const path = require('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
  entry : './src/index.js',
  output : {
    path : path.resolve(__dirname , 'dist'),
    filename: 'index_bundle.js'
  },
  module : {
    rules : [
      {test : /\.(js)$/, use:'babel-loader'},
      {
        test: /\.(sass|scss)$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ]
  },
  mode:'development',
  plugins : [
    new HtmlWebpackPlugin ({
      template : 'public/index.html'
    })
  ]

}
