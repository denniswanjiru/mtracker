const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    dashboard: "./src/components/Dashboard.js",
    details: "./src/components/Details.js",
    signin: "./src/components/Signin.js",
    signup: "./src/components/Signup.js",
    requests: "./src/components/Requests.js"
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
            presets: ["babel-preset-env", "stage-2"]
          }
        }
      }
    ]
  },
  devtool: "inline-source-map"
};
