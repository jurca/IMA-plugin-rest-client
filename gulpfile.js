require('babel-core/register.js')({
	'plugins': [
		'babel-plugin-transform-es2015-modules-commonjs'
	].map(require.resolve) // fixes the issue with babel loader & linked modules
});

let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');

gulp.task('build', ['clean', 'build:js', 'copy:metafile'], () => {
});

gulp.task('copy:metafile', ['clean'], () => {
	return gulp.src('./package.json')
		.pipe(gulp.dest('./dist'));
});

gulp.task('build:js', ['clean'], () => {
	return gulp.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			presets: ['es2015'],
			plugins: []
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
	return del('./dist');
});

gulp.task('test', () => {
	return (
		gulp.src('./src/**/*Spec.js')
			.pipe(jasmine({ includeStackTrace: true }))
	);
});

gulp.task('dev', () => {
	gulp.watch(['./src/**/*.js'], ['test']);
});
