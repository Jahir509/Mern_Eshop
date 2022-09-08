const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin')
const assets = './**/*.js';
const assets2 = '../public/uploads/*.*';
const publicDir = 'public/javascripts'

// Lint Task
gulp.task('lint', function () {
    return gulp.src(assets)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Concatenate and minify all JS files
gulp.task('scripts',async function () {
    return gulp.src(assets)
        .pipe(concat('global.js'))
        .pipe(gulp.dest(publicDir))
        .pipe(rename('global.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicDir));
});

// Watch Files For Changes
gulp.task('watch',async function () {
    gulp.watch(assets2, ['minify']);
});

// start
gulp.task('demon',async function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        // env: {
        //     'NODE_ENV': 'development'
        // }
    })
    .on('start', ['minify'])
    .on('change', function (){
        console.log('changed')
    })
    .on('restart', function () {
        console.log('restarted!');
    });
});

// Default Task
// gulp.task('default', ['demon','minify']);

// image minify
gulp.task('minify',async function(){
    console.log("Hello")
    return gulp.src('../public/uploads/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/compressed'))
})
