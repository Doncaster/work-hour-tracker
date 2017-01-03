var _ = require('lodash');

var webpackConfig = require('./webpack.config');
webpackConfig.entry = {};

webpackConfig.plugins = _.filter(webpackConfig.plugins, function(plugin) {
  return plugin.constructor.name !== 'CommonsChunkPlugin';
});

webpackConfig.module.loaders = webpackConfig.module.loaders.concat({
    test: /\.json$/,
    loader: 'json-loader'
});

webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/**/*.test.js'
    ],
    preprocessors: {
      'src/**/*.test.js': ['webpack']
    },
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    browserConsoleLogOptions: {
      terminal: true
    }
  })
};
