module.exports = {
  // Example setup for your project:
  // The entry module that requires or imports the rest of your project.
  // Must start with `./`!
  entry: './index.js',
  // Place output files in `./dist/my-app.js`
  output: {
    path: 'dist',
    filename: 'tics-auth-app.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loaders: ['json-loader']},
    ]
  }
};