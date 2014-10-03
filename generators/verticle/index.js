'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var VertxGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.log('You called the vertx subgenerator with the argument ' + this.name + '.');
  },

  writing: function () {
    var packagePath = this.config.get('packagePath'); 
    this.src.copy('Verticle.java', 'src/main/java/'+packagePath+this.name+'.java');
  }
});

module.exports = VertxGenerator;
