const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    dashboard: "./src/components/Admin/Dashboard.js",
    admin_details: "./src/components/Admin/RequestDetails.js",
    details: "./src/components/Client/RequestDetails.js",
    edit: "./src/components/Client/Edit.js",
    newRequest: "./src/components/Client/NewRequest.js",
    requests: "./src/components/Client/Requests.js",
    signin: "./src/components/Guest/Signin.js",
    signup: "./src/components/Guest/Signup.js"
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
