const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const inject = require('gulp-inject');

// Paths
const paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
    
    tmp: 'tmp',
    tmpIndex: 'tmp/*.html',
    tmpCSS: 'tmp/styles/*.css',
    tmpJS: 'tmp/scripts/*.js',
    
    dist: 'dist',
    distIndex: 'dist/*.html',
    distCSS: 'dist/styles/*.css',
    distJS: 'dist/scripts/*.js',
};

// HTML task
gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.tmp));
});

// CSS task
gulp.task('css', function () {
    return gulp.src(paths.srcCSS)
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('tmp/styles')); // Output to tmp/styles
});

// JS task
gulp.task('js', function () {
    return gulp.src(paths.srcJS)
        .pipe(rename({suffix: '.min'}))
        .pipe(terser())
        .pipe(gulp.dest('tmp/scripts')); // Output to tmp/scripts
});

// Inject task
gulp.task('inject', gulp.series('html', 'css', 'js', function () {
    const css = gulp.src(paths.tmpCSS, {read: false});
    const js = gulp.src(paths.tmpJS, {read: false});
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, { ignorePath: paths.tmp, addPrefix: '.', addRootSlash: false }))
        .pipe(inject(js, { ignorePath: paths.tmp, addPrefix: '.', addRootSlash: false }))
        .pipe(gulp.dest(paths.dist));
}));

gulp.task('copy:assets', function() {
    gulp.src(paths.tmpCSS)
        .pipe(gulp.dest('dist/styles')); 
    return gulp.src(paths.tmpJS)
        .pipe(gulp.dest('dist/scripts')); 
});

// Build task
gulp.task('build', gulp.series('inject', 'copy:assets'));
