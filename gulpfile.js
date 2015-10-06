// require
var gulp = require("gulp");
var del = require("del");
var $ = require("gulp-load-plugins")();
var browserSync = require('browser-sync').create();
// configs
var paths = {
    src: {
        stylesheet: {
            css: "src/css/",
            scss: "src/scss/**/*.scss"
        },
        javascript: {
            js: "src/js/"
        },
        html: "src/**/*.html"
    },
    dist: {
        base: "dist/",
        stylesheet: {
            css: "dist/css/"
        },
        javascript: {
            js: "dist/js/"
        }
    }
};

var browserList = [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// tasks


gulp.task("sass", function(){
    gulp.src(paths.src.stylesheet.scss)
        .pipe($.sass({outputStyle: 'expanded'}).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: browserList}))
        .pipe(gulp.dest(paths.src.stylesheet.css));
});

gulp.task("watch", function(){
    gulp.watch(paths.src.stylesheet.scss, ["sass"]);
});

gulp.task("serve", function(){
    browserSync.init({
        server: "./src"
    });
    gulp.watch(['src/**/*.{scss,css}'], ["sass", browserSync.reload]);
    gulp.watch(['src/**/*.html'], browserSync.reload);
});

gulp.task("clean:dist", function(){
    return del([paths.dist.base]);
});

gulp.task("dist", ["clean:dist"], function(){
    var assets = $.useref.assets();

    return gulp.src(paths.src.html)
        .pipe(assets)
        .pipe($.if("*.css", $.minifyCss()))
        .pipe($.if("*.js", $.uglify()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest("dist"));
});

gulp.task("default", function(){});
