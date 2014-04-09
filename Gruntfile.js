// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),
    
    	// configure watch to auto update ------------------------------------------
        watch: {
    
          // for stylesheets, watch css and less files
          // only run less and cssmin
          stylesheets: {
            files: ['public/stylesheets/blog.css',
            'public/stylesheets/explore.css',
            'public/stylesheets/build.css'],
            tasks: ['cssmin']
          },
    
          // for scripts, run jshint and uglify
          scripts: {
            files: ['public/javascripts/graphhandler.js',
            'public/javascripts/rendergraph.js',
            'public/javascripts/article_searcher.js',
            'public/javascripts/note.js'],
            tasks: ['uglify']
          }
        },

	// all of our configuration will go here
	
		// configure jshint to validate js files -----------------------------------
		jshint: {
	      options: {
	        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
	      },
	
		  // when this task is run, lint the Gruntfile and all js files in src
	      build: ['public/javascripts/graphhandler.js', 'public/javascripts/explorehandler.js', 'app.js', 'public/javascripts/blogparser.js','public/javascripts/bloghandler.js']
	    },
	    
	    // configure uglify to minify js files -------------------------------------
	    uglify: {
	      options: {
	        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
	      },
	      build: {
	        files: {
	          'public/build/js/graphhandler.min.js': 'public/javascripts/graphhandler.js',
	          'public/build/js/rendergraph.min.js': 'public/javascripts/rendergraph.js',
	          'public/build/js/article_searcher.min.js': 'public/javascripts/article_searcher.js',
	          'public/build/js/note.min.js': 'public/javascripts/note.js'
	          
	        }
	      }
	    },
	    
	    // configure cssmin to minify css files ------------------------------------
	    cssmin: {
	      options: {
	        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
	      },
	      build: {
	        files: {
	          'public/build/css/blog.min.css': 'public/stylesheets/blog.css',
	          'public/build/css/explore.min.css': 'public/stylesheets/explore.css',
	          'public/build/css/build.min.css': 'public/stylesheets/build.css'
	        }
	      }
	    }

  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // ===========================================================================
  // CREATE TASKS ==============================================================
  // ===========================================================================
  //grunt.registerTask('build', ['uglify', 'cssmin']);
  grunt.registerTask('default', ['uglify', 'cssmin','jshint']);
  

};