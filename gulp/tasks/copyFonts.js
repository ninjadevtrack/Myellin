'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyFonts', function() {

  gulp.src(config.sourceDir + 'fonts/*.{eot,svg,ttf,woff,woff2}').pipe(gulp.dest(config.buildDir + 'fonts/'));

});