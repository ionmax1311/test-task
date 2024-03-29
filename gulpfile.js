const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const include = require("gulp-file-include");
const del = require("del");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const sync = require("browser-sync").create();

function html() {
  return src("src/**/**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: false,
      })
    )
    .pipe(dest("dist"));
}

function scss() {
  return src("src/scss/**.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
}

function img() {
  return src("src/img/**").pipe(dest("dist/img"));
}

function fonts() {
  return src("src/fonts/**").pipe(dest("dist/fonts"));
}

function clear() {
  return del("dist");
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("src/**/**.html", series(html)).on("change", sync.reload);
  watch("src/scss/**.scss", series(scss)).on("change", sync.reload);

  watch("src/img", series(img)).on("change", sync.reload);
  watch("src/fonts", series(fonts)).on("change", sync.reload);
}

exports.build = series(clear, scss, html, img, fonts);
exports.serve = series(clear, scss, html, img, fonts, serve);
exports.clear = clear;
