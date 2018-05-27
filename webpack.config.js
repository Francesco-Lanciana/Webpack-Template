var path = require('path');
const merge = require('webpack-merge');

const parts = require('./config/webpack.parts');
const common = require('./config/webpack.common');
const devConfig = require('./config/webpack.development');
const prodConfig = require('./config/webpack.production');
const helpers = require('./config/webpack.helpers');

// Contains configuration common to both development and production
const commonConfig = common.config();

module.exports = (mode) => {
    if (mode === "production") {
        return merge(commonConfig, prodConfig(env.analyze));
    }

    return merge(commonConfig, devConfig());
};
