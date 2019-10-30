var fs = require('fs');
const path = require('path');
var _ = require('lodash');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');

var firebaseConfig = JSON.parse(fs.readFileSync('firebase.config.json'));

module.exports = function(env) {
    const isProd = env ? !!env.prod : false;
    return {
        entry: {
            favicon: './public/favicon.ico',
            app: './src/index.jsx',
            vendor: [
                'react', 'react-dom', 'react-redux', 'moment', 'firebase', 'lodash',
                'redux', 'redux-saga', 'redux-logger', 'babel-polyfill']
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'js/[name].[hash].bundle.js'
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        // modules: false,
                        presets: ['es2015', 'react'],
                        plugins: ['transform-class-properties']
                    }
                }]
            },{
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },{
                test: /\.(woff2?|ttf|eot)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'assets/[name].[ext]'
                    }
                }]
            },{
                test: /\.svg$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[name].[ext]'
                    }
                }]
            },{
                test: /\.ico$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            }]
        },
        plugins: _.concat([
            new HtmlWebpackPlugin({
                template: 'public/index.html',
                inject: 'body',
                excludeChunks: ['favicon']
            }),
            new Webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'js/vendor.[hash].bundle.js'}),
            new Webpack.DefinePlugin({
                FIREBASE_API_KEY: JSON.stringify(firebaseConfig.apiKey),
                FIREBASE_AUTH_DOMAIN: JSON.stringify(firebaseConfig.authDomain),
                FIREBASE_DB_URL: JSON.stringify(firebaseConfig.databaseUrl),
                FIREBASE_STORAGE_BUCKET: JSON.stringify(firebaseConfig.storageBucket),
                FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(firebaseConfig.messagingSenderId),

                'process.env': {
                    NODE_ENV: isProd ? JSON.stringify('production') : null
                }
            })
        ], (isProd ? new Webpack.optimize.UglifyJsPlugin() : [])
        ),
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '/index.jsx', '/index.js']
        },
        devServer: {
            port: 3001,
            contentBase: './build',
            inline: true
        },
        devtool: 'inline-source-map'
        // mode: isProd ? 'production' : 'development'
    };
}
