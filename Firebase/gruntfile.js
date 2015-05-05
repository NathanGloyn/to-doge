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
			all:['js/presenter.js','js/list.js', 'js/listItemModel.js','js/converter.js','js/storage.js','js/doge.js', 'js/userActions.js']
		},
		clean: ['deploy/*'],		
		concat: {
			dist: {
				src: ['js/presenter.js','js/userActions.js','js/list.js', 'js/listItemModel.js','js/reviver.js','js/storage.js','js/doge.js'],
				dest: 'app.js'
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					src:  ['list.css', 'doge.jpg', 'index.html','app.js','firebase.json'],
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
		}	
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('createDeployDir', function(){
		grunt.file.mkdir('deploy')
	});
	
	grunt.registerTask('localBuild', ['jshint','createDeployDir','clean','concat','copy']);
	grunt.registerTask('release',['uglify','createDeployDir','clean','copy']);	
	grunt.registerTask('serve',['connect']);
};