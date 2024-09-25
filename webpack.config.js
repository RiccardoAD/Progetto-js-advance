const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    mode: "production",
    entry: "./src/js/index.js",
    output: {
      filename: "main.[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ],
    devtool: 'source-map', 
  };