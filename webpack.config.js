let webpack = require('webpack');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let APP_DIR = path.resolve(__dirname, './app');
let DEV_BUILD = path.resolve(__dirname, './public');

let env = process.env.NODE_ENV.trim();
function buid_path() {
    return DEV_BUILD;
}

function getPlugIn() {
    return [
    new webpack.ProvidePlugin({
        Promise: 'bluebird'
    }),
    new webpack.optimize.CommonsChunkPlugin({
            name:"vendor", 
            filename:"vendor.js",
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ]
}

let config = {
    entry: {
        app: APP_DIR + '/main.js',
        vendor: [
            'moment'
        ]
    },
    output: {
        path: buid_path(),
        filename: 'index.js'
    },
    devServer: {
        inline: true,
        port: 3030
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: ['es2015', 'react', "stage-2"]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?sourceMap']
            },
            {
                test: /\.(svg|jpg|png|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }
            }
        ]
    },
    plugins: getPlugIn(),
    resolve: {
    extensions: ['.js', '.jsx'],
        alias: {
            "rootSource": __dirname + "/app",
            "container_source": __dirname + "/app/containers",
            "app_components": __dirname + "/app/components",
            "app_actions": __dirname + "/app/actions",
            "app_reducers": __dirname + "/app/reducers",
            "app_constants": __dirname + "/app/constants"
        },
    } ,
  devtool: "#inline-source-map"
};

module.exports = config;
