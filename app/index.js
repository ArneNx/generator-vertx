'use strict';
// var util = require('util');
// var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var VertxGenerator = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the Vertx generator!\nVisit http://vertx.io/ for more information.'
    ));

    this.log('');

    var prompts = [{
      type: 'list',
      name: 'templateType',
      message: 'Which template do you want to use?',
      choices: ['Standard Template', 'Gradle Template', 'Maven Template'],
      default: 0
    }];

    this.prompt(prompts, function(selection) {
      this.templateType = selection.templateType;
      done();
    }.bind(this));
  },

  writing: {
    template: function() {
      switch (this.templateType) {
        case 'Standard Template':
          this.log('Standard Template not implented yet!');
          break;
        case 'Gradle Template':
          this._gradle();
          break;
        case 'Maven Template':
          this.log('Standard Template not implented yet!');
          break;
        default:
          this.log('Selected Option invalid!');
          break;
      }
    }

  },

  _gradle: function() {
    this.extract('https://github.com/vert-x/vertx-gradle-template/archive/master.zip', this.destinationRoot(), function(error) {
      if (error !== undefined) {
        this.log('error: ' + error);
      }
    });
  }

});

module.exports = VertxGenerator;
