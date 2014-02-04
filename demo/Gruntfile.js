'use strict'
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      combine: {
        files: {
          'public/css/combine.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'public/css/style.css'
          ]
        }
      },
      minify: {
        expand: true,
        cwd: 'public/css/',
        src: ['combine.css'],
        dest: 'public/css/',
        ext: '.min.css'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'config/app.js',
          'app/*.js'
        ],
        dest: 'public/js/combine.js'
      }
    },
    stylus: {
      compile: {
        files: {
          'public/css/style.css': 'public/css/style.styl' // 1:1 compile
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'public/js/combine.min.js': ['public/js/combine.js']
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {                       // Target options
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,                  // Enable dynamic expansion
            cwd: 'public/img/',                   // Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest: 'public/img/'                  // Destination path prefix
          }
        ]
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'index.html': 'public/views/index.html'
        }
      }
    },
    watch: {
      minifyall: {
        files: ['public/css/style.styl', 'config/*.js', 'app/**/*.js'],
        tasks: ['stylus', 'cssmin', 'concat'],
        options: {
          spawn: false
        }
      }
    }
  });

  // Load the plugin that provides the "cssmin" task
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Load concat
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load concat
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load image min
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  // Load stylus compiler
  grunt.loadNpmTasks('grunt-contrib-stylus');
  // html min
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  // Load a watcher
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['cssmin', 'concat', 'uglify', 'stylus', 'imagemin']);

  // Dev task(s).
  grunt.registerTask('dev', ['cssmin', 'concat', 'uglify', 'stylus', 'watch']);

};