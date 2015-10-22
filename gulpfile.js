/*global -$ */
'use strict';
// generated on 2015-10-16 using generator-es6-webapp 0.1.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var angularTemplateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var addStream = require('add-stream');
var runSequence = require('run-sequence');

gulp.task('templates', function() {
  var config = {
    htmltemplates: 'app/templates/**/*.html',
    templateCache: {
      file: 'templates.js',
      options: {
        // module: 'app.core',
        root: 'templates/',
        standAlone: false
      }
    },
    temp: './.tmp'
  };

  return gulp.src(config.htmltemplates)
    //.pipe(minify and preprocess the template html here)
    .pipe(
      angularTemplateCache(
        config.templateCache.file,
        config.templateCache.options))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('es6', function() {
  browserify({
      entries: ['./app/scripts/main.js', './.tmp/templates.js'],
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    // .pipe(addStream.obj(prepareTemplates()))
    // .pipe(concat('app.js'))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('processSource', function(callback) {
  runSequence(['eslint'], 'templates', ['es6'], callback);
});

gulp.task('eslint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.eslint())
    .pipe(reload({
      stream: true,
      once: true
    }))
    /* Outputs hinting to console */
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
});


gulp.task('less', function() {
  return gulp.src('app/styles/*.less')
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.postcss([
      require('autoprefixer-core')({
        browsers: ['last 1 version']
      })
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({
      stream: true
    }));
});


gulp.task('html', function() {
  var assets = $.useref.assets({
    searchPath: ['.tmp']
  });

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{
        cleanupIDs: false
      }]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('sounds', function() {
  return gulp.src('app/sounds/**/*')
    .pipe(gulp.dest('dist/sounds'));
});

gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')({
      filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function() {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));


// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep({
      //      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('preflight', ['eslint']);

gulp.task('produce', ['preflight', 'wiredep', 'processSource', 'less', 'images', 'fonts', 'sounds']);

gulp.task('package', ['produce', 'html', 'extras']);

gulp.task('serve', ['produce'], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.less', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
  gulp.watch('app/scripts/**/*.js', ['src']);
});

gulp.task('serve:dist', ['package'], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['produce'], function() {
  browserSync({
    notify: false,
    open: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test'
    }
  });

  gulp.watch([
    'test/spec/**/*.js',
  ]).on('change', reload);

});

gulp.task('build', ['package'], function() {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
