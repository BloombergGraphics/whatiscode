'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: ['index.html'],
      options:{
        dest: 'public'
      }
    },
    usemin: {
      html: ['public/index.html'],
    },
    copy: {
      html: {
        files: [
          { src: 'index.html', dest: 'public/index.html' },
        ]
      },
      images: {
        files: [
          { expand: true, src: 'media/*.*', dest: 'public/' },
          { expand: true, src: 'images/*.*', dest: 'public/' },
          { expand: true, src: 'images/emotes/*.*', dest: 'public/' },
        ]
      },
      misc: {
        files: [
          { expand: true, src: 'scripts/tracker.js', dest: 'public/' },
        ]
      }
    }
  });


  // grunt.loadNpmTasks('grunt-filerev');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('build', [
    'useminPrepare',
    'concat',
    'cssmin',
    // 'uglify',
    'copy',
    'usemin',
  ]);


  grunt.registerTask('default', ['build']);
};
