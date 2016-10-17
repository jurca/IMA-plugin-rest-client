require('babel-core/register.js')({
	'plugins': [
		require('babel-plugin-transform-es2015-modules-commonjs')
	]
});

let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');

gulp.task('build', ['clean', 'build:js', 'copy'], () => {});

gulp.task('copy', ['copy:metafile', 'copy:readme'], () => {});

gulp.task('copy:readme', ['clean'], () => {
	return gulp.src('./README.md')
		.pipe(gulp.dest('./dist'));
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
