const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var path = require('path');
var fs = require('fs');

 //Style loaders to be used in production (SASS files)
const prodSassLoaders = [
    {
        loader: 'css-loader',
        options: {
            importLoaders: 2,
            sourceMap: false,
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: () => ([
                require('postcss-cssnext')(),
            ]),
            sourceMap: false,
        },
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: false,
        },
    },
];


 //Style loaders to be used in development (SASS files)
const devSassLoaders = [
    'style-loader',
    {
        loader: 'css-loader',
        options: {
            importLoaders: 2,
            sourceMap: true,
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: () => ([
                require('postcss-cssnext')(),
            ]),
            sourceMap: true,
        },
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true,
        },
    },
];


 //Loaders and corresponding options applied to files in production
exports.extractStyleSheets = ({ include, exclude } = {}) => {

    const plugin = new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader, 
                        "css-loader"
                    ]
                },
                {
                    test: /\.scss$/,
                    include,
                    exclude,
                    use: [
                        MiniCssExtractPlugin.loader, 
                        ...prodSassLoaders 
                    ]
                },
            ],
        },
        plugins: [plugin],
    };
};


 //Loaders and corresponding options applied to files in development,
 //as style sheets are only extracted in production.
exports.loadStyleSheets = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                include,
                exclude,
                use: devSassLoaders,
            },
        ],
    },
});


exports.loadImages = ({ include, exclude, options } = {}) => {

    const urlOptions = Object.assign({},
        options,
        { name: '[name]-[contenthash:8].[ext]' }
    );

    return {
        module: {
            rules: [
                {
                    test: /\.(gif|png|jpe?g)$/i,
                    include,
                    exclude,

                    use: [
                        {
                            loader: 'url-loader',
                            options: urlOptions,
                        }//,
//                        {
//                            loader: 'image-webpack-loader',
//                            options: {
//                                //pngquant: {
//                                //quality: '35-60',
//                                //speed: 4,
//                                //},
//                            },
//                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: urlOptions
                        }
                    ]
                },
            ],
        },
    }
};


exports.loadFonts = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                // Capture eot, ttf, woff, and woff2
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                include,
                exclude,

                use: {
                    loader: 'file-loader',
                    options,
                },
            },
        ],
    },
});


exports.loadJavaScript = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include,
                exclude,
                loader: 'babel-loader',
                options: {
                    presets: [
                        path.resolve(__dirname, "../node_modules/babel-preset-env"),
                        path.resolve(__dirname, "../node_modules/babel-preset-react")
                    ],
                    plugins: [
                        path.resolve(__dirname, "../node_modules/react-hot-loader/babel"),
                        path.resolve(__dirname, "../node_modules/babel-plugin-transform-object-rest-spread"),
                        path.resolve(__dirname, "../node_modules/babel-plugin-syntax-dynamic-import")
                    ],
                },
            },
        ],
    },
});


exports.setEntryPoints = ({ entry, hotReload }) => {
    if (!hotReload) return { entry };

    const entryPoints = {};
    const hotModuleEntryTemplates = ['react-hot-loader/patch', 'webpack/hot/only-dev-server'];

    // The last entry in this array is what is exposed by the library option (not currently using)
    return { entry: [...hotModuleEntryTemplates, entry ] };
}


exports.setBundleSizeLimits = () => ({
    performance: {
        hints: 'warning', // 'error' or false are valid too
        maxEntrypointSize: 250000, // in bytes
        maxAssetSize: 250000, // in bytes
    }
});


exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
});


exports.cleanBuildDirectory = ({root, path}) => ({
    plugins: [
        new CleanWebpackPlugin([path], {
            root,
        }),
    ],
});


exports.extractHTML = ({ template }) => {
    return {
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template,
                inject: true,
            }),
        ],
    }
};

exports.minifyCSS = () => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
                // Run cssnano in safe mode to avoid
                // potentially unsafe transformations.
                safe: true,
            },
            canPrint: false,
        }),
    ],
});

exports.setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env),
        ],
    };
};

exports.enableHotReload = () => {
    return {
        devServer: {
            //open: true,
            host: "0.0.0.0",
            port: "8080",
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            quiet: false,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
        ],
    }
}

exports.bundleVisualizer = () => {
    return {
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    }
}