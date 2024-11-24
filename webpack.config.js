const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.js', // Your JavaScript entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[name][ext]', // Asset output path
    clean: true, // Clean the output folder before each build
  },
  module: {
    rules: [
      {
        test: /\.html$/i, // Match HTML files
        loader: 'html-loader', // Process HTML
        options: {
          sources: true, // Enable processing of <img> src and other asset URLs
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Match image files
        type: 'asset/resource', // Copy image files to the output folder
      },
      {
        test: /\.css$/i, // Match CSS files
        use: ['style-loader', 'css-loader'], // Process and inject CSS
      },
    ],
  },
  plugins: [
    // Automatically injects JS bundle into the HTML and outputs it to dist
    ...glob.sync('./src/**/*.html').map((htmlFile) => {
      return new HtmlWebpackPlugin({
        template: htmlFile, // Source HTML file
        filename: path.basename(htmlFile), // Output file name in dist
      });
    }),

    // Copies static assets from src/assets to dist/assets
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'), // Source directory for static files
          to: path.resolve(__dirname, 'dist/assets'), // Output directory
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // Serve files from dist
    },
    port: 3000, // Port for the dev server
    open: true, // Open the browser automatically
    compress: true, // Enable gzip compression
    hot: true, // Enable hot module replacement
  },
};
