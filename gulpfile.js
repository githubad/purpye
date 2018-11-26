var gulp = require('gulp'),
postcss  = require('gulp-postcss'),
autoprefixer  = require('autoprefixer'),
cssvars  = require('postcss-simple-vars'),
nested  = require('postcss-nested'),
cssImport = require('postcss-import'),
browserSync = require('browser-sync').create(),
merge = require('merge-stream');


gulp.task('default', function() {
	gulp.start(['watch']);
});


gulp.task('styles' , function() {
   return gulp.src('./website/assets/styles/styles.css')
	 .pipe(postcss([cssvars, autoprefixer, nested, cssImport]))
	 .on('error', function(errorInfo) {
		 console.log(errorInfo.toString());
		this.emit('end')
	  })
   .pipe(gulp.dest('./website/temp/styles'));

});


gulp.task('watch',function(){

	browserSync.init({
		notify:false,
		server: {
			baseDir: "website"
		}
	});

	gulp.watch('./website/index.html',
	function() {
		browserSync.reload();
	});

	gulp.watch('./website/assets/styles/**/*.css',
	function() {
		gulp.start('cssInject');

	});

	gulp.watch('./website/temp/images/**/*.*',
	function() {
		browserSync.reload();

	});
});


gulp.task('cssInject', ['styles'], function(){
	return gulp.src('./website/temp/styles/styles.css')
	.pipe(browserSync.stream());
});



var vendors = ['jquery/dist', 'bootstrap/dist', 'font-awesome'];

gulp.task('vendors', function() {
  return merge(vendors.map(function(vendor) {
    return gulp.src('node_modules/' + vendor + '/**/*')
      .pipe(gulp.dest('./website/temp/vendors/' + vendor.replace(/\/.*/, '')));
  }));
});
