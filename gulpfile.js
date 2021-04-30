const { src, dest, task, watch, series, parallel } = require('gulp')
const config = require('./config.js')
const browserSync = require('browser-sync').create()

function liveServer(done) {
  browserSync.init({
    server: {
      baseDir: config.paths.dist.base,
    },
    port: config.server.port || 8080,
  })
  done()
}

function liveReload() {
  browserSync.reload()
  done()
}

function HTML() {
  return src(`${config.paths.src.base}/**/*.html`).pipe(
    dest(config.paths.dist.base)
  )
}

function liveWatch() {
  watch(`${config.paths.src.base}/**/*.html`, series(HTML, liveReload))
}

exports.default = series(parallel(HTML), liveServer, liveWatch)
