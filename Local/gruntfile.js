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
				dest: 'app.js'
				// dest: '../../../Dropbox/Public/app.js'
			}
		},
		connect: {
			server: {
				options: {
					port:3000,
					keepalive: true
				}
			}
		},
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	
	grunt.registerTask('serve',['connect']);
	grunt.registerTask('localBuild',['concat'])
};