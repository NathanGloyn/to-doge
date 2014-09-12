module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			build: {
				files: {
					'app.js': ['js/*.js']
				}
			}
		},
		jshint: {
			all:['js/*.js']
		},
		concat: {
			dist: {
				src: ['js/presenter.js','js/list.js', 'js/listItemModel.js','js/reviver.js','js/storage.js','js/doge.js'],
				dest: '../../../Dropbox/Public/app.js'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
};