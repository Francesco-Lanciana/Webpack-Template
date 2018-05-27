const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const parts = require('./webpack.parts');


const productionConfig = (analyze) => {

    const projectRootPath = path.resolve(__dirname, "../src");

    const prodConfig = merge([
        { mode: "production" },
        parts.setEntryPoints({ entry: path.resolve(projectRootPath, 'app.js'), hotReload: false }),
        parts.setBundleSizeLimits(),
        parts.cleanBuildDirectory({ root: path.resolve(__dirname, '..'), path: 'build' }),
        parts.minifyCSS(),
        parts.extractStyleSheets(),
        parts.loadImages({
            options: {
                limit: 1000, // After optimization limit
                name: '[name].[hash:8].[ext]',
            },
        }),
        parts.loadFonts({
            options: {
                name: './fonts/[name].[hash:8].[ext]',
                publicPath: '../',
            },
        }),
        parts.extractHTML({
            template: path.resolve(__dirname, '../src/index.html'),
        }),
        parts.loadJavaScript({
            include: projectRootPath,
            exclude: /(node_modules|bower_components)/,
        }),
    ]);

    /* It's really important to be able to analyze the output of the production build so
    we can tell if there is a lot of overlap between bundles, or if unnecessary libraries are included */
    if (analyze) {
        return merge([ prodConfig, parts.bundleVisualizer() ]);
    } else {
        return prodConfig;
    }

}


module.exports = (analyze) => {
  return productionConfig(analyze);
};
