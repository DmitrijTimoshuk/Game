const gulp = require('gulp'),
			babel = require('gulp-babel'), // babel-core, babel-preset-es2015, babili
			browserSync = require('browser-sync').create();

let log = console.log;

gulp.task('default', ['browser', 'babel'], function () {
	gulp.watch(['app/*.{html,js}', 'src/*.js']).on('change', function (event) {
		if (~event.path.indexOf('.js')) {
		 gulp.start('babel');
		}
		browserSync.reload();
	});
});

gulp.task('babel', function () {
  return gulp.src('src/*.js')
		.pipe(babel())
		.pipe(gulp.dest('app'));
});

gulp.task('browser', function () {
	browserSync.init({
		server: {
			baseDir: './app' // proxy for PHP or Python
		},
		notify: false
	});
});