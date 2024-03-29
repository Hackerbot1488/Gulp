let preprocessor = 'sass'
const { src, dest, parallel, series, watch } = require('gulp')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const cleancss = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const del = require('del')

function browserSyncFunc() {
  browserSync.init({
    server: { baseDir: 'app/' },
    port: 5000,
    notify: false,
    online: true
    // online: false //cant watch on phone
  })
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'app/js/app.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}

function styles() {
  return src(`app/${preprocessor}/main.${preprocessor}`)
    .pipe(eval(preprocessor)())
    .pipe(concat('app.min.css'))
    .pipe(autoprefixer({
      overrideBrowserlist: ['last 10 versions'],
      grid: true
    }))
    .pipe(cleancss(({
      level: { 1: { specialComments: 0 } },
      // format: 'beautify'
    })))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}

function images() {
  return src('app/images/src/**/*')
    .pipe(newer('app/images/dest'))
    .pipe(imagemin())
    .pipe(dest('app/images/dest'))
}

function cleanImages() {
  return del('app/images/dest/**/*', {
    force: true
  })
}

function cleanDist() {
  return del('dist/**/*', {
    force: true
  })
}

function buildcopy() {
  return src([
    'app/css/*.min.css',
    'app/js/*.min.js',
    'app/images/dest/**/*',
    'app/**/*.html',
  ], { base: 'app' })
    .pipe(dest('dist'))
}

function startWatch() {
  watch([`app/**/${preprocessor}/**/*`], styles)
  watch(['app/**/*.js', '!app/**/*min.js'], scripts)
  watch(['app/**/*.html']).on('change', browserSync.reload)
  watch(['app/images/src'], images)
}

exports.browsersync = browserSyncFunc
exports.scripts = scripts
exports.styles = styles
exports.images = images
exports.clean = cleanImages
exports.cleanDist = cleanDist
exports.build = series(cleanDist, styles, scripts, images, buildcopy)
exports.default = parallel(scripts, styles, browserSyncFunc, startWatch)