const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const path = require('path');


const developmentConfig = (projectsMetaData) => {

    const projectRootPath = path.resolve(__dirname, "../src");

    var options = merge([
        { mode: "development" },
        parts.setEntryPoints({ entry: path.resolve(projectRootPath, 'app.js'), hotReload: true }),
        parts.extractHTML({ template: path.resolve(projectRootPath, 'index.html') }),
        parts.enableHotReload(),
        parts.loadJavaScript({ include: projectRootPath, exclude: /(node_modules|bower_components)/ }),
        parts.loadStyleSheets({ exclude: /node_modules/ }),
        parts.loadImages({ options: { limit: 1000 } }),
        parts.loadFonts(),
        parts.generateSourceMaps({ type: 'eval-source-map' }),
    ]);

    return options;
}


module.exports = () => {
    return developmentConfig();
};
