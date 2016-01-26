module.exports = function KarmaConfig(config) {
    var configuration = {
        basePath: '..',
        frameworks: ['browserify', 'jasmine'],
        files: ['test/**/*.spec.js'],
        preprocessors:{'test/**/*.spec.js': ['browserify']},
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false,
        broserify: {
            debug: true,
            paths: ['./node_modules', {ignore: ['bower_components']}, 'partialify'],
            extensions: ['.js', '.html']
        }
    };

    config.set(configuration);
}
