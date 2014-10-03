'use strict';
// var util = require('util');
// var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var shelljs = require('shelljs');


var VertxGenerator = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../../package.json');
    this.projectName = this.destinationRoot().slice(this.destinationRoot().lastIndexOf('/') + 1);
    this.archetypeVersion = '2.0.8-final';
    this.projectVersion = '1.0';
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
      name: 'author',
      message: 'What\'s your name?'
    }, {
      type: 'input',
      name: 'projectName',
      message: 'What\'s the name of this project?',
      default: this.projectName
    }, {
      type: 'input',
      name: 'projectVersion',
      message: 'What\'s the version number of this project?',
      default: this.projectVersion
    }, {
      type: 'input',
      name: 'packageName',
      message: 'What\'s the name of the default package you want to use?',
      default: 'com.' + this.projectName
    }, {
      when: function(answers) {
        return 'Maven Template' === answers.templateType;
      },
      type: 'input',
      name: 'archetypeVersion',
      message: 'Which version of the vertx-archetype should we use?',
      default: this.archetypeVersion
    }];

    this.prompt(prompts, function(answers) {
      this.templateType = answers.templateType;
      this.author = answers.author;
      this.projectName = answers.projectName;
      this.projectVersion = answers.projectVersion;
      this.packageName = answers.packageName;
      this.archetypeVersion = answers.archetypeVersion;
      this.config.set('author', this.author);
      this.config.set('projectVersion', this.projectVersion);
      this.config.set('packageName', this.packageName);
      this.config.set('templateType', this.templateType);
      done();
    }.bind(this));
  },

  writing: {
    template: function() {
      switch (this.templateType) {
        case 'Standard Template':
          this._standard();
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
      //gradle.properties
      var filePath = that.destinationRoot() + '/gradle.properties';
      var properties = that.readFileAsString(filePath);
      properties = properties.replace(/modowner=[a-z0-9.,]*\n/i, 'modowner=' + that.author + '\n');
      properties = properties.replace(/modname=[a-z0-9.,\-]*\n/i, 'modname=' + that.projectName + '\n');
      properties = properties.replace(/version=[a-z0-9.,\-]*\n/i, 'version=' + that.projectVersion + '\n');
      that.writeFileFromString(properties, filePath);
      //mod.json
      // filePath = that.destinationRoot() + '/src/main/resources/mod.json';
      // var modJson = that.dest.readJSON(filePath);
      // modJson.author = that.author;
      // modJson.developers = [that.author];
      // modJson.keywords = [];
      // that.writeJSON(filePath, modJson);
    });

  },

  _maven: function() {
    if (!shelljs.which('mvn')) {
      this.log('Sorry, you need to install Maven first!');
      this.log('Check out: http://maven.apache.org/download.cgi#Installation or use your Software manager.');
    } else {
      shelljs
        .exec('mvn archetype:generate -DinteractiveMode=false -DarchetypeGroupId=io.vertx -DarchetypeArtifactId=vertx-maven-archetype -DarchetypeVersion=' +
          this.archetypeVersion + ' -DgroupId=' + this.packageName + ' -DartifactId=' + this.projectName + ' -Dversion=' + this.projectVersion);
    }
  },

  _standard: function() {
    this.copy('gitignore', '.gitignore');
    this.copy('README.md', 'README.md');
    this.copy('vertx_classpath.txt', 'vertx_classpath.txt');
    this.mkdir('src');
    this.mkdir('src/main');
    this.mkdir('src/main/java');
    var packageFolders = this.packageName.split('.');
    var path = 'src/main/java';
    for (var i in packageFolders) {
      path = path + '/' + packageFolders[i];
      this.mkdir(path);
    }
    this.config.set('packagePath', path+'/');
    this.copy('src/main/java/com/myPackage/PingVerticle.java', path + '/PingVerticle.java');
    this.mkdir('src/main/resources');
    this.copy('src/main/resources/mod.json', 'src/main/resources/mod.json');
    this.mkdir('src/site');
    this.mkdir('src/test');
  }

});

module.exports = VertxGenerator;
