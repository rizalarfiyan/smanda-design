const { src, dest, task, watch, series, parallel } = require('gulp')
const config = require('./config.js')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
const del = require('del')

function liveServer(done) {
  browserSync.init({
    server: {
      baseDir: config.paths.dist.base,
    },
    port: config.server.port || 8080,
  })
  done()
}

function liveReload(done) {
  browserSync.reload()
  done()
}

function HTML() {
  return src(`${config.paths.src.base}/**/*.html`).pipe(
    dest(config.paths.dist.base)
  )
}

function CSS() {
  return src(`${config.paths.src.css}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([require('autoprefixer')]))
    .pipe(concat({ path: 'style.css' }))
    .pipe(dest(config.paths.dist.css))
}

function JS() {
  return src([`${config.paths.src.js}/**/*.js`])
    .pipe(concat({ path: 'scripts.js' }))
    .pipe(dest(config.paths.dist.js))
}

function rmImages() {
  return del([config.paths.dist.images])
}

function images() {
  return src(`${config.paths.src.images}/**/*.{jpg,jpeg,png,gif,tiff,svg}`).pipe(dest(config.paths.dist.images))
}

function liveWatch() {
  watch(`${config.paths.src.base}/**/*.html`, series(HTML, liveReload))
  watch(`${config.paths.src.css}/**/*.scss`, series(CSS, liveReload))
  watch(`${config.paths.src.js}/**/*.js`, series(JS, liveReload))
  watch(
    `${config.paths.src.images}/**/*.{jpg,jpeg,png,gif,tiff,svg}`,
    series(rmImages, images, liveReload)
  )
}

function devClean() {
  return del([config.paths.dist.base])
}

exports.default = series(
  devClean,
  parallel(CSS, images, JS, HTML),
  liveServer,
  liveWatch
)
