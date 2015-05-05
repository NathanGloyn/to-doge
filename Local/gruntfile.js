module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			build: {
				files: {
					'app.js': ['js/presenter.js','js/list.js', 'js/listItemModel.js','js/reviver.js','js/storage.js','js/doge.js']
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
			}
		},
		clean: ['deploy/*'],
		copy: {
			main: {
				files: [{
					expand: true,
					src:  ['list.css', 'doge.jpg', 'jquery-2.1.3.min.js','index.html','app.js'],
					dest: 'deploy/'
				}]
			}
		},
		connect: {
			server: {
				options: {
					port:3000,
					base: 'deploy',
					keepalive: true
				}
			}
		},
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('serve',['connect']);
	grunt.registerTask('localBuild',['jshint','concat','clean','copy']);
	grunt.registerTask('release',['uglify','clean', 'copy'])
};