'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import compass from 'gulp-compass';
import sourcemaps from 'gulp-sourcemaps';
import minifyCss from 'gulp-minify-css';
import gulpif from 'gulp-if';

// Fall back include
import browserSyncConstructor from 'browser-sync';
let browserSync = browserSyncConstructor.create();

let styleOptions = {
  style: 'expanded',
  time: true,
  sourcemap: true,
  sass: global.paths.src,
  css: global.paths.tmp + 'css',
  require: ['susy', 'modular-scale', 'breakpoint', 'font-awesome-sass']
};

let compSassFilename = global.comp.name + '.scss';
let compCssFilename = global.comp.name + '.css';
/**
 * Sass Tasks
 */
let sassCompilation = function (opts) {
  let requiredTasks = [];
  opts.dest = opts.dest ? opts.dest : (opts.dist ? global.paths.dist + 'css' : global.paths.tmp + 'css');

  if (opts.dist || opts.lint) {
    requiredTasks.push('lintsass');
  }

  // defaults so gulpif knows what is what
  _.defaults(opts, {
    dist: false,
    replace: false,
    concat: false,
    bypassSourcemap: false,
    browserSync: browserSync // fall back to prevent issues with live injection
  });

  // Compile SASS with sourcemaps + livereload.
  gulp.task(opts.taskName, requiredTasks, function () {
    //gulp.src(global.paths.fonts)
    //  .pipe(gulp.dest(dest + 'fonts'));

    let data = gulp.src(global.paths.sass)
      .pipe(plumber())
      .pipe(gulpif(!opts.bypassSourcemap && !opts.dist, sourcemaps.init()))
      .pipe(compass(styleOptions))
      .pipe(gulpif(opts.replace, replace(opts.replace.this, opts.replace.with)))
      .pipe(concat(opts.concat ? opts.concat : compCssFilename))
      .pipe(autoprefixer())
      .pipe(gulpif(opts.dist, minifyCss()))
      .pipe(gulpif(opts.dist, rename({suffix: '.min'})))
      .pipe(gulpif(!opts.bypassSourcemap && !opts.dist, sourcemaps.write('./')))
      .pipe(gulp.dest(opts.dest))
      .pipe(opts.browserSync.stream());

    return data;
  });
};
export {styleOptions};
export default sassCompilation;
