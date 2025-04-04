// After using npm to install packages, use require to import
// the packages make them available in the config.
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// Main object of the config where you set options for webpack
module.exports = {
    // A file path from the config file to the entry module
    entry: './src/scripts/index.js',
    // Tells webpack how to write the compiled files to disk
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        // Cleans output folder each
        // time before bundling files into it
        clean: true,
    },
    // Adds extra functionality. Since plugins can take 
    // arguments/options, you must pass a 'new' instance 
    // to the plugins property
    plugins: [
        // Simplifies creation of HTML files that use the
        // webpack modules
        new HtmlWebpackPlugin({
            // Uses a template file to generate index.html in dist
            template: './src/template.html',
        }),
    ],
    // Determine how the different types of modules are handled
    module: {
        // Perform actions to the modules based off the conditions
        rules: [
            {
                // Include all modules that pass test assertion
                // In this case, files that end in .css
                test: /\.css$/i,
                // Apply array of loaders from end to start to 
                // modules that pass test. 'css-loader' is first
                use: ['style-loader', 'css-loader'],
            // Loaders transform the code of the module to make 
            // them compatible for bundling with other modules.
            },
        ],
    },
};