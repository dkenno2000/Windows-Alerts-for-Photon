const path = require("path");

module.exports = {
  mode: "production", // Change to "development" if needed
  // devtool: "source-map",
  devtool: false,
  entry: "./src/remastered.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "remastered.bundle.js"
  },
  target: "web", // Ensure it's targeting web for a browser environment
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js"],
    modules: [path.resolve("D:/node_modules"), "node_modules"],
    alias: {
      "@amcharts/amcharts5": path.resolve("D:/node_modules/@amcharts/amcharts5")
    }
  }
};