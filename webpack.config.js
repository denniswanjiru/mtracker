const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/app.js",
    signup: "./src/signup.js",
    signin: "./src/signin.js"
  },
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-env"]
          }
        }
      }
    ]
  },
  devtool: "inline-source-map"
};
