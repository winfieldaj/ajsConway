var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var concatCss = require('gulp-concat-css');
var debug = require('gulp-debug');
var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var karma = require('karma').server;
var lazypipe = require('lazypipe');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var partialify = require('partialify');
var pipe = require('multipipe');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var size = require('gulp-size');
var stripDebug = require('gulp-strip-debug');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var watchify = require('watchify');

// Helpers:

function bundleScripts(debug, watch) {
  var bundler = browserify('./src/app.js', {debug: debug})
    .transform(partialify)
    .transform(babelify.configure({ignore: 'bower_components'}));

  function rebundle() {
    return bundler.bundle()
      .on('error', function(error) {
        gutil.log(gutil.colors.red(error));
        if (watch) {
          this.emit('end');
        } else {
          process.exit(1);
        }
      })
      .on('log', gutil.log)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(ngAnnotate({single_quotes: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./.tmp'))
      .pipe(gulpif(watch, browserSync.stream({once: true})))
      .pipe(size());
  }

  if (watch) bundler = watchify(bundler).on('update', rebundle);

  return rebundle();
}

// Tasks:

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: ['src', 'assets', '.tmp']
    },
    port: 8080,
    ghostMode: false
  });

  gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('build', function(cb) {
  runSequence('clean', ['scripts:build', 'styles:build'], 'html', cb);
});

gulp.task('clean', function(cb) {
  del(['.tmp', 'dist'], cb);
});

gulp.task('html', function() {
  var cssFilter = filter(['**/*.css'], {restore: true});
  var htmlFilter = filter(['*.html'], {restore: true});
  var jsFilter = filter(['**/*.js'], {restore: true});
  var notHtmlFilter = filter(['**/*', '!**/*.html', '!**/*.map'], {restore: true});
  var minifyHtmlOpts = { empty : true, comments : true };

  return gulp.src('src/*.html')
    .pipe(useref({}, lazypipe().pipe(function() {
      return sourcemaps.init({loadMaps: true});
    })))
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(gulpif(isDev, sourcemaps.write('./')))
    .pipe(gulp.dest('dist'))
    .pipe(cssFilter.restore)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(gulpif(!isDev, stripDebug()))
    .pipe(gulpif(isDev, sourcemaps.write('./')))
    .pipe(gulp.dest('dist'))
    .pipe(jsFilter.restore)
    .pipe(notHtmlFilter)
    .pipe(rev())
    .pipe(notHtmlFilter.restore)
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(minifyHtml(minifyHtmlOpts))
    .pipe(htmlFilter.restore)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(size());
});

gulp.task('scripts', function() {
  return bundleScripts(true, true);
});

gulp.task('styles', function() {
  return gulp.src('src/assets/**/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('styles:build', function() {
  return gulp.src('assets/**/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('scripts:build', function(cb) {
  return bundleScripts(isDev, false);
});

gulp.task('serve', function(cb) {
  runSequence('clean', ['scripts', 'styles'], 'watch', 'browser-sync', cb);
});

gulp.task('test:tdd', function(cb) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: false,
    autoWatch: true,
    reporters: ['dots'],
  }, cb);
});

gulp.task('watch', function() {
  gulp.watch('assets/**/*.css', ['styles']);
});
