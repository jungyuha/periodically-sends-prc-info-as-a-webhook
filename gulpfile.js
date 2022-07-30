'use strict';
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
gulp.task('eslint', function () {
	return gulp
		.src([
			'**/*.js',
			'!node_modules/**',
			'!dist/**',
			'!.git/**'
		])
		// eslint() attaches the lint output to the "eslint" property
		// of the file object so it can be used by other modules.
		.pipe(plugins.eslint({fix:true}))
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(plugins.eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(plugins.eslint.failAfterError());
});

gulp.task('server', function () {
	return plugins.nodemon({
		script: 'bin/www',
		watch: 'src/'
	});
});

gulp.task('default', gulp.series('eslint', 'server'));
