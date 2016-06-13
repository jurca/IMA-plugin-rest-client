require('babel-core/register.js')({
	'plugins': [
		'babel-plugin-transform-es2015-modules-commonjs'
	].map(require.resolve) // fixes the issue with babel loader & linked modules
});

var gulp = require('gulp');
var babel = require('gulp-babel');
var jasmine = require('gulp-jasmine');


// build module
gulp.task('build', function() {
	return (
		gulp.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist'))
	);
});

//run test
gulp.task('test', () => {
	return (
		gulp.src('./src/**/*Spec.js')
			.pipe(jasmine({ includeStackTrace: true }))
	);
});


// -------------------------------------PRIVATE HELPER TASKS
gulp.task('dev', function() {
	gulp.watch(['./src/**/*.js'], ['test']);
});
