// Initialize modules
const { src, dest, watch, series } = require("gulp");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// Copy Html
function copyHtml() {
  return src("src/*.html").pipe(dest("dist"));
}

// Minify images
function imgTask() {
  return src("src/images/*").pipe(imagemin()).pipe(dest("dist/images"));
}

// Sass task
function scssTask() {
  return src("src/scss/**/*.scss", { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// JavaScript scssTask
function jsTask() {
  return src("src/js/*.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "src",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch("src/*.html", browserSyncReload);
  watch(
      ["src/**/*.js"],
      series(jsTask, browserSyncReload)
    );
}

// // Watch task
// function watchTask() {
//   watch("src/*.html", browserSyncReload);
//   watch(
//       ["src/scss/**/*.scss", "src/**/*.js"],
//       series(scssTask, jsTask, browserSyncReload)
//     );
// }

// Default gulp jsTask
exports.default = series(
  copyHtml,
  imgTask,
  scssTask,
  jsTask,
  browserSyncServe,
  watchTask
);
