
var sass_src = 'www/scss/';


var sass_main_filename = 'bootstrap';

var css_dest = 'www/css/';

var css_result_filename = 'style';

var js_concat_files = 'www/js/**/**.js';


var js_concat_res_path = 'www/js/';
var js_concat_res_file = 'script.js';


var gulp = require('gulp');
var path = require('path');
var sass  = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer'); 



var indexFile = 'www/index.html';
var sassFiles = sass_src + '**/*.scss';
var sassMain = sass_src + '' + sass_main_filename + '.scss';

gulp.task('sass', function() {	
	return gulp.src(sassMain)
	.pipe(sass({
		generateSourceMap: true,
		      paths: [ path.join(__dirname, 'sass') ]
	}))
	.on('error', swallowError)
	.pipe(rename({
		basename: css_result_filename
	}))
	.pipe(gulp.dest(css_dest));
});

gulp.task('minify-css', ['sass'], function() {
	gulp.src(css_dest+css_result_filename+'.css')
    		.pipe(minifyCSS({keepBreaks:true}))
    		.pipe(rename({
    			basename: css_result_filename,
    			suffix: '.min'
    		}))
   		.pipe(gulp.dest(css_dest))
});

gulp.task('js-concat', function() {
	gulp.src(js_concat_files)
		.pipe(concat(js_concat_res_file))
		.pipe(gulp.dest(js_concat_res_path))
		/*.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))*/
		.pipe(gulp.dest(js_concat_res_path))
		.on('error', swallowError)
});


var localhost = '192.168.1.56';

gulp.task('browser-sync', function() {
	browserSync({
        		server: {
			baseDir: './www'
		}
    });
});

gulp.task('autoprefixer', function() {
	return gulp.src('src/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('browser-reload', ['minify-css'], function() {
	browserSync.reload();
});

gulp.task('browser-reload-htmlonly', function() {
    browserSync.reload();
});


gulp.task('watch',function () { 
	gulp.start(['browser-sync','sass']);
	gulp.watch(indexFile,['browser-reload-htmlonly']);
	gulp.watch(sassFiles,['browser-reload']);
	gulp.watch(js_concat_files,['browser-reload', 'js-concat']);
});

gulp.task('default', ['minify-css', 'autoprefixer', 'js-concat','watch']);

function swallowError (error) {
	console.log(error.toString());
	this.emit('end');
}