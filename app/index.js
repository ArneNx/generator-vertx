'use strict';
// var util = require('util');
// var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var shelljs = require('shelljs');


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
    }, {
      type: 'input',
      name: 'owner',
      message: 'What\'s your name?'
    }, {
      type: 'input',
      name: 'appName',
      message: 'What\'s the name of this project?',
      default: this.destinationRoot().slice(this.destinationRoot().lastIndexOf('/') + 1)
    }];

    this.prompt(prompts, function(answers) {
      this.templateType = answers.templateType;
      this.owner = answers.owner;
      this.appName = answers.appName;
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
          this._maven();
          break;
        default:
          this.log('Selected Option invalid!');
          break;
      }
    }

  },

  _gradle: function() {
    var that = this;
    this.extract('https://github.com/vert-x/vertx-gradle-template/archive/master.zip', this.destinationRoot(), function(error) {
      if (error !== undefined) {}
      var filePath = that.destinationRoot() + '/gradle.properties';
      var properties = that.readFileAsString(filePath);
      properties = properties.replace(/modowner=[a-z0-9.,]*\n/i, 'modowner=' + that.owner + '\n');
      properties = properties.replace(/modname=[a-z0-9.,\-]*\n/i, 'modname=' + that.appName + '\n');
      that.writeFileFromString(properties, filePath);
    });

  },

  _maven: function() {
    if (!shelljs.which('mvn')) {
      this.log('Sorry, you need to install Maven first!');
      this.log('Check out: http://maven.apache.org/download.cgi#Installation or use your Software manager.');
    } else {
      var atVersion = '2.0.8-final';
      shelljs
        .exec('mvn archetype:generate -DinteractiveMode=false -DarchetypeGroupId=io.vertx -DarchetypeArtifactId=vertx-maven-archetype -DarchetypeVersion='+
        atVersion+' -DgroupId=com.foo.bar -DartifactId='+this.appName+' -Dversion=1.0');
    }
  }

});

module.exports = VertxGenerator;
