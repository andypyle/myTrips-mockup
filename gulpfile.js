// Require Gulp & friends.
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    jade = require('gulp-jade'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    browserSync = require('browser-sync').create();

// Set up directories.
var sources = {
  'sass':{
    'in':'./src/sass/style.sass',
    'out':'./src/styles/',
    'opts':{
      'outputStyle': 'expanded'
    }
  },
  'jade':{
    'in':'./src/jade/**/*.jade',
    'out':'./src',
    'opts':{
      'locals': {},
      'pretty': '\t'
    }
  },
  'js':{
    'in':'./src/js/main.js',
    'out':'./src/js'
  },
  'img':{
    'in':'./src/img/**/*'
  },
  'build':{
    'css':'./build/styles',
    'js':'./build/js',
    'html':'./build',
    'img':'./build/img'
  }
}


// Start browser-sync.
gulp.task('browsersync', function(){
  browserSync.init({
      server: './src'
    });

  gulp.watch('./src/sass/**/*.sass', ['sass']);
  gulp.watch('./src/jade/**/*.jade', ['jade']);
  gulp.watch('./src/*.html').on('change', browserSync.reload);
});


// SASS compiling
gulp.task('sass', function(){
  gulp.src(sources.sass.in)
    .pipe(sass(sources.sass.opts)
    .on('error', sass.logError))
    .pipe(prefix({
      browsers: [
                      '> 1%',
                      'last 2 versions',
                      'firefox >= 4',
                      'safari 7',
                      'safari 8',
                      'IE 8',
                      'IE 9',
                      'IE 10',
                      'IE 11'
                  ],
      cascade: true
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(sources.sass.out))
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(sources.sass.out))
    .pipe(gulp.dest(sources.build.css))
    .pipe(browserSync.stream());
    //.pipe(connect.reload());
});
/// End SASS


// Jade compiling
gulp.task('jade', function(){
  gulp.src([sources.jade.in, '!src/jade/layout.jade'])
		.pipe(jade(sources.jade.opts))
		.pipe(gulp.dest(sources.jade.out))
    .pipe(gulp.dest(sources.build.html))
    .pipe(connect.reload());
});
/// End jade compiling


// JavaScript linting
gulp.task('jshint', function() {
  return gulp.src(sources.js.in)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
/// End JS linting


// JavaScript minify
gulp.task('scripts', function() {
  return browserify('./src/js/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(sources.js.out))
    .pipe(uglify())
    .pipe(gulp.dest(sources.build.js));
});
/// End JS minify


// Image optimization
gulp.task('images', function() {
  gulp.src(sources.img.in)
    .pipe(imagemin())
    .pipe(gulp.dest(sources.build.img));
});
// End image optimization


// Gulp-connect
gulp.task('connect', function(){
  connect.server({
    root: 'src',
    port: 3000,
    livereload: true
  });
});


// Build 
gulp.task('build', ['jshint', 'scripts', 'sass', 'images', 'jade']);
// End build


gulp.task('watch', function(){
	gulp.watch(['./src/sass/**/*.sass', './src/jade/**/*.jade', './src/js/main.js'], ['sass','jade','jshint','scripts']);
});

gulp.task('default', ['browsersync','images','sass','jade','jshint','scripts','watch']);
