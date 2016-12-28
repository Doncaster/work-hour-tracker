var fs = require('fs');
var argv = require('yargs').argv;
var _ = require('lodash');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');

var firebaseConfig = JSON.parse(fs.readFileSync('firebase.config.json'));

module.exports = {
    entry: {
        favicon: './public/favicon.ico',
        app: './src/index.jsx',
        vendor: ['react', 'react-dom', 'react-redux', 'moment', 'firebase', 'lodash', 'redux', 'redux-thunk', 'redux-logger']
    },
    output: {
        path: './build',
        filename: 'js/[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react'],
                plugins: ['transform-class-properties']
            }
        },{
            test: /\.less$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!less-loader'
        },{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },{
            test: /\.(woff2?|ttf|eot)$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'assets/[name].[ext]'
            }
        },{
            test: /\.svg$/,
            loader: 'file-loader',
            query: {
                name: 'assets/[name].[ext]'
            }
        },{
            test: /\.ico$/,
            loader: 'file-loader',
            query: {
                name: '[name].[ext]'
            }
        }]
    },
    plugins: _.concat([
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: 'body',
            excludeChunks: ['favicon']
        }),
        new Webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js'),
        new Webpack.DefinePlugin({
            FIREBASE_API_KEY: JSON.stringify(firebaseConfig.apiKey),
            FIREBASE_AUTH_DOMAIN: JSON.stringify(firebaseConfig.authDomain),
            FIREBASE_DB_URL: JSON.stringify(firebaseConfig.databaseUrl),
            FIREBASE_STORAGE_BUCKET: JSON.stringify(firebaseConfig.storageBucket),
            FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(firebaseConfig.messagingSenderId),

            'process.env': {
                NODE_ENV: (argv.prod ? JSON.stringify('production') : null)
            }
        })
    ], (argv.prod ? new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }) : [])
    ),
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '/index.jsx', '/index.js', '']
    },
    devServer: {
        port: 3001,
        contentBase: './build',
        inline: true
    },
    devtool: '#source-map'
};