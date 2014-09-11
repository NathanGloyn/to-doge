module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			build: {
				files: {
					'app.js': ['js/*.js']
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
};