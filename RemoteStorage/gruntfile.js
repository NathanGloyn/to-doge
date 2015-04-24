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
			all:['js/presenter.js','js/list.js', 'js/listItemModel.js','js/converter.js','js/storage.js','js/doge.js']
		},
		concat: {
			dist: {
				src: ['js/remoteStorage.js','js/remoteStorage-Module.js','js/presenter.js','js/list.js', 'js/listItemModel.js','js/converter.js','js/storage.js','js/doge.js'],
				dest: 'deploy/app.js'
			}
		},
		clean: ['deploy/*'],		
		copy: {
			main: {
				files: [{
					expand: true,
					src:  ['list.css', 'doge.jpg', 'jquery-2.1.3.min.js','index.html'],
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
	
	grunt.registerTask('localBuild',['jshint','concat','clean','copy']);
	grunt.registerTask('serve',['connect']);
	grunt.registerTask('release',['uglify','clean','copy']);
};