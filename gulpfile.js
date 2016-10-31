require('babel-core/register.js')({
	'plugins': [
		require('babel-plugin-transform-es2015-modules-commonjs')
	]
});

let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');

exports.build = function build() {
	return gulp.series(
		clean,
		gulp.parallel(
			build_js,
			copy
		)
	);
};

exports.copy = function copy() {
	return gulp.parallel(exports.copy_metafile, copy_readme);
};

exports.copy_readme = function copy_readme() {
	return gulp
		.src('./README.md')
		.pipe(gulp.dest('./dist'));
};

exports.copy_metafile = function copy_metafile() {
	return gulp
		.src('./package.json')
		.pipe(gulp.dest('./dist'));
};

exports.build_js = function build_js() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			presets: ['es2015'],
			plugins: []
		}))
		.pipe(gulp.dest('./dist'));
};

exports.clean = function clean() {
	return del('./dist');
};

exports.test = function test() {
	return gulp
		.src('./src/**/*Spec.js')
		.pipe(jasmine({includeStackTrace: true}));
};

exports.dev = function dev() {
	return gulp.watch(['./src/**/*.js'], test);
};
