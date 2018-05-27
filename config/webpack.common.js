/*
    TODO: Output filenames will be the same every build. This will cause serious caching issues.
          We need to include content hashes while not breaking existing script tags
*/
const parts = require('./webpack.parts');
const helpers = require('./webpack.helpers');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');


exports.config = () => {
    return merge([
        {
            output: {
                path: path.resolve(__dirname, '../build'),
                filename: '[name]-bundle.js',
                devtoolModuleFilenameTemplate: (info) => {
                    let shortenedPath;
                    
                    if (info.absoluteResourcePath.includes('node_modules')) {
                        shortenedAbsPath = info.absoluteResourcePath.split(`node_modules${path.sep}`).pop();
                        return `webpack:///Node Modules/${shortenedAbsPath}`;
                    } else {
                        shortenedAbsPath = info.absoluteResourcePath.split(`src${path.sep}`).pop();
                        return `webpack:///${shortenedAbsPath}`;
                    }                    
                },
                // File-loader (with source maps enabled) breaks without setting the publicPath to an absolute url
                publicPath: 'http://localhost:8080/', 
            },
            resolve: {
                alias: helpers.generateAliases(),
                extensions: [".js", ".jsx", ".css", ".scss", ".json"]
            },
            optimization: {
                runtimeChunk: "single",
            }
        },
    ]);
};
