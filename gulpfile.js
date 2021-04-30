const { src, dest, task, watch, series, parallel } = require('gulp')
const config = require('./config.js')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')

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

function liveWatch() {
  watch(`${config.paths.src.base}/**/*.html`, series(HTML, liveReload))
  watch(`${config.paths.src.base}/**/*.scss`, series(CSS, liveReload))
}

exports.default = series(parallel(CSS, HTML), liveServer, liveWatch)
